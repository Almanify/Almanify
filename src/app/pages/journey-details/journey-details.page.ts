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
        this.people),
      new Payment(
        '2',
        'Exa_Payment2',
        'Hanz',
        1337.69,
        '€',
        new Date(2022, 10, 12),
        PaymentCategory.FoodAndDrink,
        this.people),
      new Payment(
        '3',
        'Exa_Payment3',
        'Bob',
        420.69,
        '€',
        new Date(2022, 20, 4),
        PaymentCategory.Entertainment,
        this.people),
      new Payment(
        '4',
        'Exa_Payment4',
        'Sally',
        42.69,
        '€',
        new Date(2022, 10, 6),
        PaymentCategory.Transfer,
        this.people),
      new Payment(
        '5',
        'Exa_Payment5',
        'John',
        1337.69,
        '€',
        new Date(2022, 10, 12),
        PaymentCategory.Other,
        this.people),
      new Payment(
        '6',
        'Exa_Payment6',
        'Hendrik',
        420.69,
        '€',
        new Date(2022, 20, 4),
        PaymentCategory.Entertainment,
        this.people),
      new Payment(
        '2',
        'Exa_Payment2',
        'Sven',
        1337.69,
        '€',
        new Date(2022, 10, 12),
        PaymentCategory.FoodAndDrink,
        [
          'Bob',
          'Sally',
        ]),
      new Payment(
        '3',
        'Exa_Payment3',
        'Bob',
        420.69,
        '€',
        new Date(2022, 20, 4),
        PaymentCategory.Entertainment,
        this.people),
      new Payment(
        '4',
        'Exa_Payment4',
        'Hanz',
        42.69,
        '€',
        new Date(2022, 10, 6),
        PaymentCategory.Accommodation,
        this.people),
      new Payment(
        '5',
        'Exa_Payment5',
        'Hanz',
        1337.69,
        '€',
        new Date(2022, 10, 12),
        PaymentCategory.FoodAndDrink,
        this.people),
      new Payment(
        '6',
        'Exa_Payment6',
        'Bob',
        420.69,
        '€',
        new Date(2022, 20, 4),
        PaymentCategory.Entertainment,
        this.people)
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
