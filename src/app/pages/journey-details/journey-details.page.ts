import {Component, OnInit} from '@angular/core';
import {Payment, PaymentCategory} from '../../data/Payment';
import {ActivatedRoute} from '@angular/router';
import {AlertController, NavController} from '@ionic/angular';
import {DatabaseService} from '../../services/database.service';
import {AuthenticationService} from '../../services/auth.service';
import {Journey} from '../../data/Journey';
import {User} from '../../data/User';
import {formatCurrency, convertFromCurrency} from '../../services/helper/currencies';

@Component({
  selector: 'app-journey-details',
  templateUrl: './journey-details.page.html',
  styleUrls: ['./journey-details.page.scss'],
})
export class JourneyDetailsPage implements OnInit {
  formatCurrency = formatCurrency;
  userId = '';
  journey: Journey;
  payments: Payment[] = [];
  journeyParticipants: User[] = [];
  sortBy = 'date';
  lowToHigh = 'false'; //need as string for binding
  userIdMap: Map<string, User> = new Map();
  isLoaded = false;

  constructor(private activatedRoute: ActivatedRoute,
              public navCtrl: NavController,
              private databaseService: DatabaseService,
              public authenticationService: AuthenticationService,
              private alertCtrl: AlertController,
              private route: ActivatedRoute) {
    this.route.url.subscribe(() => {
      if (this.journey && this.isLoaded) {
        this.loadPayments(this.journey);
      }
    });

    this.journey = new Journey();
    this.journey.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  /**
   * Loads the journey and calls the functions to load the payments and participants
   */
  loadJourney() {
    this.databaseService.journeyCrudHandler.readByID(this.journey.id).then(journey => {
      this.journey = journey;
      this.loadPayments(journey);
      this.loadParticipants(journey);
    });
  }

  /**
   * Loads the payments for the journey
   *
   * @param journey the journey to load the payments for
   */
  loadPayments(journey: Journey) {
    this.databaseService.getJourneyPayments(journey.id).then((payments) => {
      this.payments = payments;
      this.sortPayments();
      this.isLoaded = true;
    });
  }

  /**
   * Loads the participants of the journey
   *
   * @param journey the journey to load the participants of
   */
  loadParticipants(journey: Journey) {
    journey.journeyParticipants
      .forEach(participant => this.databaseService.userCrudHandler
        .readByID(participant)
        .then((u) => {
          this.journeyParticipants.push(u);
          this.userIdMap.set(u.id, u);
        }));
  }

  /**
   * Toggles the sorting of the payments between ascending and descending
   */
  toggleSort() {
    this.lowToHigh = this.lowToHigh === 'false' ? 'true' : 'false';
    this.sortPayments();
  }

  /**
   * Sorts the payments by the selected sorting method
   */
  sortPayments() {
    switch (this.sortBy) {
      case 'payer':
        this.payments.sort((x, y) => (this.userIdMap.get(x.payerID).userName > this.userIdMap.get(y.payerID).userName ? -1 : 1));
        break;
      case 'payedValue':
        this.payments.sort((x, y) => (convertFromCurrency(x.value, x.currency) > convertFromCurrency(y.value, y.currency) ? -1 : 1));
        break;
      default:
        this.payments.sort((x, y) => y.payday.seconds - x.payday.seconds);
    }
    if (this.lowToHigh === 'true') { // need string for binding
      this.payments.reverse();
    }
  }

  /**
   * Angular lifecycle hook that is called when the page is initialized
   */
  ngOnInit() {
    this.authenticationService.expectUserId().then((id) => {
      this.userId = id;
      this.loadJourney();
    });
  }

  /**
   * Navigates to the payment details page to add a new payment
   */
  async addPayment() {
    await this.navCtrl.navigateForward('/payment-details/' + true + '/' + this.journey.id);
  }

  /**
   * Deletes a payment after the user confirmed the deletion
   *
   * @param payment the payment to delete
   */
  async deletePayment(payment: Payment) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Payment',
      message: 'Do you really want to delete this payment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.databaseService.paymentCrudHandler.delete(payment).then(() => this.loadJourney());
          },
        }
      ],
    });
    await alert.present();
  }

  /**
   * Navigates to the payment details page to view the details of a payment
   *
   * @param payment the payment to view
   */
  async viewPayment(payment: Payment) {
    await this.navCtrl.navigateForward('/payment-details/' + false + '/' + this.journey.id + '/' + payment.id);
  }

  /**
   * Navigates to the payment details page to edit a payment
   *
   * @param payment the payment to edit
   */
  async editPayment(payment: Payment) {
    await this.navCtrl.navigateForward('/payment-details/' + true + '/' + this.journey.id + '/' + payment.id);
  }

  /**
   * Navigates to the debts page to view the debts of the journey
   */
  async viewDebts() {
    await this.navCtrl.navigateForward('/debts/' + this.journey.id);
  }

  /**
   * Returns the icon for the category of a payment
   *
   * @param category the category of the payment
   */
  getCategoryIcon(category: string) {
    switch (category) {
      case PaymentCategory.accommodation:
        return 'bed';
      case PaymentCategory.entertainment:
        return 'game-controller';
      case PaymentCategory.foodAndDrink:
        return 'fast-food';
      case PaymentCategory.transfer:
        return 'airplane';
      case PaymentCategory.debtRepayment:
        return 'cash';
      default:
        return 'infinite';
    }
  }

}
