import {Component, OnInit} from '@angular/core';
import {Payment, PaymentCategory} from '../../data/Payment';
import {ActivatedRoute, Router} from '@angular/router';
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

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              public navCtrl: NavController,
              private databaseService: DatabaseService,
              public authenticationService: AuthenticationService,
              private alertCtrl: AlertController) {
    this.journey = new Journey();
    this.journey.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  loadJourney() {
    this.databaseService.journeyCrudHandler.readByID(this.journey.id).then(journey => {
      this.journey = journey;
      this.loadPayments(journey);
      this.loadParticipants(journey);
    });
  }

  loadPayments(journey: Journey) {
    this.databaseService.getJourneyPayments(journey.id).then((payments) => {
      this.payments = payments;
      this.sortPayments();
    });
  }


  loadParticipants(journey: Journey) {
    journey.journeyParticipants
      .forEach(participant => this.databaseService.userCrudHandler
        .readByID(participant)
        .then((u) => {
          this.journeyParticipants.push(u);
          this.userIdMap.set(u.id, u);
        }));
  }

  toggleSort() {
    this.lowToHigh = this.lowToHigh === 'false' ? 'true' : 'false';
    this.sortPayments();
  }

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

  ngOnInit() {
    this.authenticationService.expectUserId().then((id) => {
      this.userId = id;
      this.loadJourney();
    });
  }

  async addPayment() {
    await this.navCtrl.navigateForward('/payment-details/' + true + '/' + this.journey.id);
  }

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

  async viewPayment(payment: Payment) {
    await this.navCtrl.navigateForward('/payment-details/' + false + '/' + this.journey.id + '/' + payment.id);
  }

  async editPayment(payment: Payment) {
    await this.navCtrl.navigateForward('/payment-details/' + true + '/' + this.journey.id + '/' + payment.id);
  }

  async viewDebts() {
    await this.navCtrl.navigateForward('/debts/' + this.journey.id);
  }


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
