import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from 'src/app/services/database.service';
import {Journey} from '../../data/Journey';
import * as Lodash from 'lodash';
import {AuthenticationService} from '../../services/auth.service';
import {AlertController, IonRouterOutlet, NavController} from '@ionic/angular';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-journey-editor',
  templateUrl: './journey-editor.page.html',
  styleUrls: ['./journey-editor.page.scss'],
})
export class JourneyEditorPage implements OnInit {

  currencies: Array<string> = undefined;
  people;
  journey;
  isEditMode = false;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private databaseService: DatabaseService,
              public authService: AuthenticationService,
              public navCtrl: NavController,
              private alertController: AlertController,
              public outlet: IonRouterOutlet,) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.journey = new Journey('', '', authService.getUserId, '', Timestamp.fromDate(new Date()), Timestamp.fromDate(new Date()), []);
    if (id != null) {
      this.isEditMode = true;
      this.journey.id = id;
      this.journey =  this.databaseService.journeyCRUDHandler.read(this.journey)
      console.log(this.journey)
    } else {
      this.journey.journeyParticipants = [authService.getUserId];
      databaseService.generateInviteCode().then(inviteCode => {
        this.journey.inviteCode = inviteCode;
      });
    }
    this.currencies = [
      '€',
      '$',
      '¥'
    ];
    this.people = ['Hanz', 'Maier', 'Wurst'];
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
            this.back();
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

  ngOnInit() {

  }


}
