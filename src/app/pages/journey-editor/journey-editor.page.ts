import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from 'src/app/services/database.service';
import {Journey} from '../../data/Journey';
import * as Lodash from 'lodash';
import {AuthenticationService} from '../../services/auth.service';
import {JourneyParticipation} from '../../data/JourneyParticipation';
import {AlertController, IonDatetime, IonRouterOutlet, NavController} from '@ionic/angular';
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
  journey: Journey;
  isEditMode = false;

  private journeys: Journey[];
  private owner: JourneyParticipation;
  private journeyParticipants: JourneyParticipation[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private databaseService: DatabaseService,
              public authService: AuthenticationService,
              public navCtrl: NavController,
              private alertController: AlertController,
              public outlet: IonRouterOutlet,) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.journey = new Journey('', '', authService.getUserId, /*TODO*/'1', new Timestamp(0, 0), new Timestamp(0, 0));
    this.owner = new JourneyParticipation(authService.getUserId, '');
    this.journeyParticipants.push(this.owner);
    if (id != null) {
      this.isEditMode = true;
      this.databaseService.getJourneys().then(journeys => {
        console.log(journeys);
        this.journeys = journeys;
        this.journey.id = id;
        this.loadJourney();
        console.log('This Journey', this.journey);
      });

      /*//low effort security TODO: mabye find a better/saver way
      if (this.journey.creatorID === authService.user_user_id){
        alert("You shall not pass!");
        this.back();
      }*/
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

  loadJourney() {
    this.journey = Lodash.find(this.journeys, ['id', this.journey.id]);
    this.databaseService.getJourneyParticipants().then(journeyParticipants => {
      this.journeyParticipants = journeyParticipants;
      this.loadParticipants();
    });
  }

  loadParticipants() {
    this.journeyParticipants = Lodash.filter(this.journeyParticipants, ['journeyID', this.journey.id]);
  }

  async save() {
    this.databaseService.persist(this.journey).then(id => {
      this.journeyParticipants.forEach(journeyParticipant => {
        journeyParticipant.journeyID = id.toString();
        this.databaseService.persist(journeyParticipant);
        console.log(this.journeyParticipants);
      });
    }).then(() => {
      this.navCtrl.navigateRoot('root');
      this.router.navigateByUrl('/home');
    });
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

  ngOnInit() {

  }


}
