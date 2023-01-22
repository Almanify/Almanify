import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatabaseService} from '../../services/database.service';
import {Journey} from '../../data/Journey';
import {User} from '../../data/User';
import {AuthenticationService} from '../../services/auth.service';
import {AlertController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-journey-list',
  templateUrl: './journey-list.page.html',
  styleUrls: ['./journey-list.page.scss'],
})

export class JourneyListPage implements OnInit {

  userId = '';
  journeys: Journey[] = [];
  people: Array<User> = [];

  filteredJourneys: Journey[] = [];

  journeyType = 'active';
  journeyRole = 'joined';
  isLoaded = false;

  constructor(private navController: NavController,
              private databaseService: DatabaseService,
              private authenticationService: AuthenticationService,
              private alertController: AlertController,
              private route: ActivatedRoute) {
    this.route.url.subscribe(() => {
      if(this.isLoaded) {
        this.loadJourneys();
      }
    });
  }

  /**
   * Update the filter settings and filter the journeys
   *
   * @param event the event that triggered the change
   */
  segmentChanged(event) {
    if (event.detail.value === 'active') {
      this.journeyType = 'active';
    } else if (event.detail.value === 'archived') {
      this.journeyType = 'archived';
    }
    this.filterJourneys();
  }

  /**
   * Filter the journeys based on the current filter settings
   */
  filterJourneys() {
    if (this.journeyType === 'active') {
      this.filteredJourneys = this.journeys.filter(journey => journey.active);
    } else if (this.journeyType === 'archived') {
      this.filteredJourneys = this.journeys.filter(journey => !journey.active);
    }
  }

  /**
   * View the details of a journey by navigating to the journey-details page
   *
   * @param journey the journey to view
   */
  async viewJourney(journey: Journey) {
    await this.navController.navigateForward('/journey/' + journey.id);
  }

  /**
   * View the edit page of a journey by navigating to the journey-editor page
   *
   * @param journey the journey to edit
   */
  async editJourney(journey: Journey) {
    await this.navController.navigateForward('/journey-editor/' + journey.id);
  }

  /**
   * Angular lifecycle hook that is called when the page is initialized
   *
   * We use this to get the user id and then load the journeys
   */
  ngOnInit() {
    this.authenticationService.expectUserId().then(id => {
      this.userId = id;
      return this.loadJourneys();
    });
  }

  /**
   * Load the journeys from the database
   */
  async loadJourneys() {
    await this.databaseService.getJoinedJourneys(this.userId).then((journeys) => {
      this.journeys = journeys;
      this.sortJourneys();
      this.filterJourneys();
    });
    await this.loadCreators(this.journeys);
    this.isLoaded = true;
  }

  /**
   * Sort the journeys by start date
   */
  sortJourneys() {
    this.journeys.sort((x, y) => y.start.seconds - x.start.seconds);
  }

  /**
   * Update the status of a journey in the database
   *
   * @param journey the journey to update
   */
  updateJourneyStatus(journey: Journey) {
    return this.databaseService.journeyCrudHandler.update(journey);
  }

  /**
   * Show the invite code for a journey
   *
   * @param journey the journey to show the invite code for
   */
  viewInviteCode(journey: Journey) {
    return this.navController.navigateForward('/journey/' + journey.id + '/invite');
  }

  /**
   * Ask the user to confirm the deletion of a journey
   *
   * @param journey the journey to delete
   */
  async alertDelete(journey: Journey) {
    const alert = await this.alertController.create({
      header: 'Delete journey "' + journey.title + '" and all included payments?',
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

  /**
   * Delete a journey from the database
   *
   * @param journey the journey to delete
   */
  deleteJourney(journey: Journey) {
    this.databaseService.getJourneyPayments(journey.id)
      .then(payments => payments.forEach(payment => this.databaseService.paymentCrudHandler.delete(payment)));
    this.databaseService.journeyCrudHandler.delete(journey).then(() => this.loadJourneys());
  }

  /**
   * Ask the user to confirm the archiving/activation of a journey
   *
   * @param journey the journey to archive or activate
   */
  async alertArchive(journey: Journey) {
    let alert;
    if (journey.active) {
      alert = await this.alertController.create({
        header: 'Archive journey "' + journey.title + '"?',
        buttons: [
          {
            text: 'Archive',
            role: 'confirm',
            handler: () => {
              journey.active = false;
              this.updateJourneyStatus(journey);
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ]
      });
    } else {
      alert = await this.alertController.create({
        header: 'Activate journey "' + journey.title + '"?',
        buttons: [
          {
            text: 'Activate',
            role: 'confirm',
            handler: () => {
              journey.active = true;
              this.updateJourneyStatus(journey);
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ]
      });
    }
    await alert.present();
  }

  /**
   * Load the creators of the journeys
   *
   * @param journeys the journeys to load the creators for
   */
  async loadCreators(journeys: Array<Journey>) {
    await journeys
      .forEach(journey => this.databaseService.userCrudHandler
        .readByID(journey.creatorID)
        .then((u) => {
          this.people.push(u);
    }));
  }

  /**
   * Get the name of the creator of a journey
   *
   * @param id the id of the creator
   */
  getJourneyCreator(id: string) {
    return this.people.find(person => id === person.id)?.userName || 'Unbekannt';
  }
}
