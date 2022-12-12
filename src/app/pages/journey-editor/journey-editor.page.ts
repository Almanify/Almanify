import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from 'src/app/services/database.service';
import {Journey} from '../../data/Journey';
import {AuthenticationService} from '../../services/auth.service';
import {AlertController, IonRouterOutlet, NavController} from '@ionic/angular';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {User} from '../../data/User';

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
      this.databaseService.journeyCrudHandler.read(this.journey).then(journey => {
        this.journey = journey;
        this.getParticipants(this.journey);
      });
    } else {
      databaseService.generateInviteCode().then(inviteCode => {
        this.journey.inviteCode = inviteCode;
      });
      console.log(this.journey);
    }
    this.currencies = [
      '€',
      '$',
      '¥'
    ];
  }
  ngOnInit() {
    if (!this.isEditMode) { // if new journey

      this.journey.creatorID = this.authService.getUserId; // initial fetch
      this.journey.journeyParticipants = [this.authService.getUserId]; // we assume that the creator is the only participant
      this.getParticipants(this.journey);

      this.authService.getObservable().subscribe((u) => { // subscribe to changes
        this.journey.creatorID = u;
        this.journey.journeyParticipants = [u];
        this.getParticipants(this.journey);
      });
    }
  }

  getParticipants(journey: Journey) {
    journey.journeyParticipants
      .forEach(participant => this.databaseService.userCrudHandler
        .readByID(participant)
        .then(u => this.participants.push(u)));
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
      this.databaseService.journeyCrudHandler.update(this.journey)
        .then((journeyId) => {
          this.navCtrl.navigateRoot('root');
          this.router.navigate(['/journey/' + journeyId]);
        });
    } else {
      //create new entry
      this.databaseService.journeyCrudHandler.createAndGetID(this.journey)
        .then((journeyId) => {
          this.navCtrl.navigateRoot('root');
          this.router.navigate(['/journey/' + journeyId]);
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
}
