import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DatabaseService} from '../../services/database.service';
import {Journey} from '../../data/Journey';
import {AuthenticationService} from '../../services/auth.service';
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-journey-list',
  templateUrl: './journey-list.page.html',
  styleUrls: ['./journey-list.page.scss'],
})
export class JourneyListPage implements OnInit {

  userId = '';
  journeys: Journey[] = [];

  filteredJourneys: Journey[] = [];

  journeyType = 'all';
  journeyRole = 'joined';
  databaseService: DatabaseService;
  authenticationService: AuthenticationService;

  constructor(private router: Router,
              private db: DatabaseService,
              private as: AuthenticationService,
              private alertController: AlertController) {
    this.databaseService = db;
    this.authenticationService = as;
  }

  segmentChanged(event) {
    if (event.detail.value === 'active') {
      this.journeyType = 'active';
    } else if (event.detail.value === 'archived') {
      this.journeyType = 'archived';
    } else if (event.detail.value === 'all') {
      this.journeyType = 'all';
    } else if (event.detail.value === 'joined') {
      this.journeyRole = 'joined';
    } else if (event.detail.value === 'created') {
      this.journeyRole = 'created';
    }
    this.filterJourneys();
  }

  filterJourneys() {
    if (this.journeyType === 'all') {
      this.filteredJourneys = this.journeys;
    } else if (this.journeyType === 'active') {
      this.filteredJourneys = this.journeys.filter(journey => journey.active);
    } else if (this.journeyType === 'archived') {
      this.filteredJourneys = this.journeys.filter(journey => !journey.active);
    }
    if (this.journeyRole === 'joined') {
      // nothing to do, all shown journeys joined
    } else if (this.journeyRole === 'created') {
      this.filteredJourneys = this.filteredJourneys.filter(journey => journey.creatorID === this.userId);
    }
  }

  viewJourney(journey: Journey) {
    this.router.navigate(['/journey/' + journey.id]);
  }

  editJourney(journey: Journey) {
    this.router.navigate(['/journey-editor/' + journey.id]);
  }

  ngOnInit() {
    // initial load of journeys
    this.userId = this.authenticationService.getUserId;
    this.loadJourneys();
    // watch for changes after initial load
    this.authenticationService.getObservable().subscribe(() => {
      this.userId = this.authenticationService.getUserId;
      this.loadJourneys();
    });
  }

  loadJourneys() {
    this.databaseService.getJoinedJourneys(this.userId).then((journeys) => {
      this.journeys = journeys;
      this.filterJourneys();
    });
  }

  deleteJourney(journey: Journey) {
    this.databaseService.getJourneyPayments(journey.id)
      .then(payments => payments.forEach(payment => this.databaseService.paymentCrudHandler.delete(payment)));
    this.databaseService.journeyCrudHandler.delete(journey).then(() => {
      this.loadJourneys();
    });
  }

  viewInviteCode(journey: Journey) {
    this.router.navigate(['/journey/' + journey.id + '/invite']);
  }

  async alertDelete(journey: Journey) {
    const alert = await this.alertController.create({
      header: 'Delete journey: ' + journey.title +' and all included payments?',
      buttons: [
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.deleteJourney(journey);
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
}
