import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from 'src/app/services/database.service';
import {Journey} from '../../data/Journey';
import * as Lodash from 'lodash';
import {AuthenticationService} from '../../services/auth.service';
import {AlertController, IonRouterOutlet, NavController} from '@ionic/angular';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {User} from "../../data/User";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-journey-editor',
  templateUrl: './journey-editor.page.html',
  styleUrls: ['./journey-editor.page.scss'],
})
export class JourneyEditorPage implements OnInit {

  currencies: Array<string> = undefined;
  participants: Array<User> = [];
  journey: Journey;
  isEditMode = false;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private databaseService: DatabaseService,
              public authService: AuthenticationService,
              public navCtrl: NavController,
              private alertController: AlertController,
              public outlet: IonRouterOutlet,) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.journey = new Journey('',
      '',
      '',
      '',
      Timestamp.fromDate(new Date()),
      Timestamp.fromDate(new Date()),
      []);
    if (id != null) {
      this.isEditMode = true;
      this.journey.id = id;
      this.databaseService.journeyCRUDHandler.read(this.journey).then(journey => {
        this.journey = journey;
        this.getParticipants(this.journey)
      });
    } else {
      databaseService.generateInviteCode().then(inviteCode => {
        this.journey.inviteCode = inviteCode;
      });
      console.log(this.journey)
    }
    this.currencies = [
      '€',
      '$',
      '¥'
    ];
  }
  ngOnInit() {
    if (!this.isEditMode) {
      this.authService.getObservable().subscribe((user) => {
        this.journey.creatorID = user;
        let tempSet = new Set(this.journey.journeyParticipants);
        tempSet.add(user);
        this.journey.journeyParticipants = Array.from(tempSet);
        this.getParticipants(this.journey);
      });
    }
  }

  getParticipants(journey: Journey) {
    journey.journeyParticipants
      .forEach(participant => this.databaseService.userCRUDHandler
        .readByID(participant)
        .then(user => this.participants.push(user)))
  }


  updateStartDate(value) {
    this.journey.start = Timestamp.fromDate(new Date(value));
  }

  updateEndDate(value) {
    this.journey.end = Timestamp.fromDate(new Date(value));
  }

  async save() {
    if (this.isEditMode) {
      //update database
      this.databaseService.journeyCRUDHandler.update(this.journey)
        .then(() => {
          this.navCtrl.navigateRoot('root');
          this.router.navigateByUrl('/home'); //TODO nav to journey details
        });
    } else {
      //create new entry
      this.databaseService.journeyCRUDHandler.createAndGetID(this.journey)
        .then(() => {
          this.navCtrl.navigateRoot('root');
          this.router.navigateByUrl('/home'); //TODO nav to journey details
        });
    }
  }

  async alertUnsaved() {
    const alert = await this.alertController.create({
      header: 'Leave without saving?',
      buttons: [
        {
          text: 'Save',
          role: 'confirm',
          handler: () => {
            this.save();
          },
        },
        {
          text: 'exit without saving',
          role: 'cancel',
          handler: () => {
            this.back();
          },
        },
      ],
    });
    await alert.present();
  }

  back() {
    if (this.outlet.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.navigateRoot('root');
      this.router.navigateByUrl('/home');
    }
  };

  loadQRCode() {
    // load using api
    // https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=CodeHere
    // this requests a 1000x1000px image with the data "CodeHere"

    const inviteCode = this.journey.inviteCode;
    const qrCode = document.getElementById('qrCode');

    qrCode.setAttribute('src', 'https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=' + inviteCode);
  }

}
