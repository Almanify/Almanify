import {Component, OnInit, ViewChild} from '@angular/core';
import {Payment, PaymentCategory} from '../../data/Payment';
import {ActivatedRoute, Router} from '@angular/router';
import {IonAccordionGroup, NavController} from '@ionic/angular';
import {DatabaseService} from "../../services/database.service";
import {AuthenticationService} from "../../services/auth.service";
import {Journey} from "../../data/Journey";
import {User} from "../../data/User";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import database = firebase.database;

@Component({
  selector: 'app-journey-details',
  templateUrl: './journey-details.page.html',
  styleUrls: ['./journey-details.page.scss'],
})
export class JourneyDetailsPage implements OnInit {
  userId = '';
  journey: Journey;
  payments: Payment[] = [];
  journeyParticipants: User[] = [];
  filteredPayments: Payment[] = [];
  sortBy: string = 'date';
  lowToHigh: string = 'false'; //need as string for binding
  userIdMap: Map<string, User> = new Map;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              public navCtrl: NavController,
              private databaseService: DatabaseService,
              public authenticationService: AuthenticationService) {
    this.journey = new Journey();
    this.journey.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  loadJourney() {
    this.databaseService.journeyCrudHandler.readByID(this.journey.id).then(journey => {
      this.journey = journey;
      this.loadPayments(journey);
      this.loadParticipants(journey);
    })
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

  sortPayments() {
    switch (this.sortBy) {
      case 'payer':
        this.payments.sort( (x, y) => (this.userIdMap.get(x.payerID).userName > this.userIdMap.get(y.payerID).userName ? -1 : 1));
        break;
      case 'payedValue':
        //TODO dont ignore currency
        this.payments.sort((x, y) => (x.value > y.value ? -1 : 1));
        break
      default:
        this.payments.sort((x, y) => {
          return y.payday.seconds - x.payday.seconds;
        })
    }
    if (this.lowToHigh === 'true') { // need string for binding
      this.payments.reverse();
    }
  }

  ngOnInit() {
    this.userId = this.authenticationService.getUserId;
    this.loadJourney();
    this.authenticationService.getObservable().subscribe(() => {
      this.userId = this.authenticationService.getUserId;
      this.loadJourney();
    });
  }

  addPayment() {
    this.navCtrl.navigateRoot('root');
    this.router.navigate(['/payment-details/' + true + '/' + this.journey.id]);
  }

  deletePayment(payment: Payment) {
    this.databaseService.paymentCrudHandler.delete(payment).then(() => this.loadJourney());
  }

  viewPayment(payment: Payment) {
    this.navCtrl.navigateRoot('root');
    this.router.navigate(['/payment-details/' + false + '/' + this.journey.id + '/' + payment.id]);
  }

  editPayment(payment: Payment) {
    this.navCtrl.navigateRoot('root');
    this.router.navigate(['/payment-details/' + true + '/' + '/' + this.journey.id + '/' + payment.id]);
  }

  //TODO for Hendrik:
  viewDebts() {
    this.navCtrl.navigateRoot('root');
    this.router.navigate(['/debts/' + this.journey.id]);
  }


  getCategoryIcon(category: PaymentCategory) {
    switch (category) {
      case PaymentCategory.Accommodation:
        return 'bed';
      case PaymentCategory.Entertainment:
        return 'game-controller';
      case PaymentCategory.FoodAndDrink:
        return 'fast-food';
      case PaymentCategory.Transfer:
        return 'airplane';
      default:
        return 'infinite';
    }
  }

  /*@ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;

  toggleAccordion = () => {
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'second') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'second';
    }
  };*/

}
