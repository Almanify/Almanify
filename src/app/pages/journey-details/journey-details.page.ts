import {Component, OnInit} from '@angular/core';
import {Payment, PaymentCategory} from '../../data/Payment';
import {NavigationExtras} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-journey-details',
  templateUrl: './journey-details.page.html',
  styleUrls: ['./journey-details.page.scss'],
})
export class JourneyDetailsPage implements OnInit {
  //dummys
  readonly payments: Payment[];
  people: string[];

  sortBy = 'date';
  sortOrder = 'lowToHigh';
  private journeyTitle = 'Exa_Journey_Name';
  private router: NavController;

  constructor(r: NavController) {
    this.router = r;
    this.people = [
      'Bob',
      'Sally',
      'John',
      'Jane',
      'Max',
      'Hendrik',
      'Sven',
      'Günter',
      'Peter',
      'Jürgen',
      'Anna',
      'Karl Heinz der IV',
    ];
    this.payments = [
      new Payment(
        '1',
        'Exa_Payment1',
        'Hanz',
        42.69,
        '€',
        new Date(2022, 10, 6),
        PaymentCategory.Accommodation,
        [
          'Bob',
          'Sally',
          'Hanz',
        ]),
      new Payment(
        '2',
        'Exa_Payment2',
        'Bob',
        69.42,
        '€',
        new Date(2022, 10, 7),
        PaymentCategory.Entertainment,
        [
          'Bob',
          'Sally',
        ],
      ),
    ];
  }

  ngOnInit() {
  }

  details() {
    //TODO
    console.log('going to details');
  }

  addPayment() {
    //TODO
  }

  deletePayment(payment: Payment) {
    this.payments.splice(this.payments.indexOf(payment), 1);
  }

  viewPayment(payment: Payment) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        payment: JSON.stringify(payment),
        edit: false,
        people: JSON.stringify(this.people)
      }
    };

    this.router.navigateForward(['payment-details'], navigationExtras);
  }

  editPayment(payment: Payment) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        payment: JSON.stringify(payment),
        edit: true,
        people: JSON.stringify(this.people)
      }
    };

    this.router.navigateForward(['payment-details'], navigationExtras);
  }

  viewDebts() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        payments: JSON.stringify(this.payments),
        people: JSON.stringify(this.people)
      }
    };

    this.router.navigateForward(['debts'], navigationExtras);
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
}
