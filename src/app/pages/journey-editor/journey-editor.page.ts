import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from 'src/app/services/database.service';
import {Journey} from '../../data/Journey';
import {AuthenticationService} from '../../services/auth.service';
import {AlertController, IonRouterOutlet, NavController} from '@ionic/angular';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {User} from '../../data/User';
import {currencies} from '../../services/helper/currencies';
import {PhotoService} from '../../services/photo.service';

@Component({
  selector: 'app-journey-editor',
  templateUrl: './journey-editor.page.html',
  styleUrls: ['./journey-editor.page.scss'],
})
export class JourneyEditorPage implements OnInit {

  currencies = currencies;
  participants: Array<User> = [];
  journey: Journey;
  isEditMode = false;

  // image variables
  picEvent: any;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private databaseService: DatabaseService,
              public authService: AuthenticationService,
              public navCtrl: NavController,
              private alertController: AlertController,
              public outlet: IonRouterOutlet,
              public photoService: PhotoService) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.journey = new Journey();
    if (id != null) {
      this.isEditMode = true;
      this.journey.id = id;
      this.databaseService.journeyCrudHandler.read(this.journey).then(journey => {
        // check if user is allowed to edit
        this.authService.expectUserId().then(async (uid) => {
          if (journey.creatorID !== uid) {
            await this.navCtrl.navigateBack('/journey/' + journey.id);
          } else {
            this.journey = journey;
            this.getParticipants(this.journey);
          }
        });
      });
    } else {
      databaseService.generateInviteCode().then(inviteCode => {
        this.journey.inviteCode = inviteCode;
      });
    }
  }

  ngOnInit() {
    if (!this.isEditMode) { // if new journey
      this.authService.expectUserId().then((id) => {
        this.journey.creatorID = id;
        this.journey.journeyParticipants = [id];
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

  deleteUser(user) {
    if (user.id !== this.journey.creatorID) {
      const index = this.journey.journeyParticipants.indexOf(user.id, 0);
      this.journey.journeyParticipants.splice(index, 1);
      this.participants = [];
      this.getParticipants(this.journey);
    }
  }

  updateStartDate(value) {
    this.journey.start = Timestamp.fromDate(new Date(value));
  }

  updateEndDate(value) {
    this.journey.end = Timestamp.fromDate(new Date(value));
  }

  //save with redirect variable for better user experience when trying to update thumbnails
  async save(redirect: boolean) {
    //upload picture
    if (this.picEvent) {
      await this.photoService.uploadPicFromEvent(this.picEvent, this.journey.creatorID).then(value =>
        value.toPromise().then(img => this.journey.img = img)
      );
    }
    //update & redirection if wanted
    if (this.isEditMode) {
      //update database
      const updatePromise = this.databaseService.journeyCrudHandler.update(this.journey);
      //redirection
      if (redirect) {
        updatePromise.then((journeyId) => {
          this.navCtrl.navigateRoot('root');
          this.router.navigate(['/journey/' + journeyId]);
        });
      }
    } else {
      //create new entry
      this.databaseService.journeyCrudHandler.createAndGetID(this.journey)
        .then((journeyId) => {
          this.navCtrl.navigateRoot('root');
          this.router.navigate(['/journey/' + journeyId]);
          this.router.navigate(['/journey/' + journeyId + '/invite']);
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
            this.save(true);
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

  async alertDelete(journey: Journey) {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete the thumbnail for ' + journey.title + '?',
      buttons: [
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.deletePic();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  async back() {
    if (this.outlet.canGoBack()) {
      await this.navCtrl.pop();
    } else {
      await this.navCtrl.navigateRoot('home');
    }
  }

  async saveEvent(event) {
    this.picEvent = event;
  }

  async deletePic() {
    this.photoService.deletePic(this.journey.img);
    this.journey.img = null;
    await this.save(false);
  }
}
