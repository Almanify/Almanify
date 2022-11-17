import {Component, OnInit} from '@angular/core';
import {Payment, PaymentCategory} from "../../data/Payment";

@Component({
  selector: 'app-journey-details',
  templateUrl: './journey-details.page.html',
  styleUrls: ['./journey-details.page.scss'],
})
export class JourneyDetailsPage implements OnInit {
  //dummys
  private journeyTitle: string = 'Exa_Journey_Name';
  private payments: Payment[];

  sortBy = 'date';
  sortOrder = 'lowToHigh';
  constructor() {
    let people = [
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
        "€",
        new Date(2022, 10, 6),
        PaymentCategory.Accommodation,
        people),
      new Payment(
        '2',
        'Exa_Payment2',
        'Hanz',
        1337.69,
        "€",
        new Date(2022, 10, 12),
        PaymentCategory.FoodAndDrink,
        people),
      new Payment(
        '3',
        'Exa_Payment3',
        'Bob',
        420.69,
        "€",
        new Date(2022, 20, 4),
        PaymentCategory.Entertainment,
        people),
      new Payment(
        '4',
        'Exa_Payment4',
        'Hanz',
        42.69,
        "€",
        new Date(2022, 10, 6),
        PaymentCategory.Transfer,
        people),
      new Payment(
        '5',
        'Exa_Payment5',
        'Hanz',
        1337.69,
        "€",
        new Date(2022, 10, 12),
        PaymentCategory.Other,
        people),
      new Payment(
        '6',
        'Exa_Payment6',
        'Bob',
        420.69,
        "€",
        new Date(2022, 20, 4),
        PaymentCategory.Entertainment,
        people),
      new Payment(
        '2',
        'Exa_Payment2',
        'Hanz',
        1337.69,
        "€",
        new Date(2022, 10, 12),
        PaymentCategory.FoodAndDrink,
        people),
      new Payment(
        '3',
        'Exa_Payment3',
        'Bob',
        420.69,
        "€",
        new Date(2022, 20, 4),
        PaymentCategory.Entertainment,
        people),
      new Payment(
        '4',
        'Exa_Payment4',
        'Hanz',
        42.69,
        "€",
        new Date(2022, 10, 6),
        PaymentCategory.Accommodation,
        people),
      new Payment(
        '5',
        'Exa_Payment5',
        'Hanz',
        1337.69,
        "€",
        new Date(2022, 10, 12),
        PaymentCategory.FoodAndDrink,
        people),
      new Payment(
        '6',
        'Exa_Payment6',
        'Bob',
        420.69,
        "€",
        new Date(2022, 20, 4),
        PaymentCategory.Entertainment,
        people)
    ]
  }

  ngOnInit() {
  }

  details() {
    //TODO
    console.log("going to details");
  }

  addPayment() {
    //TODO
  }

  getCategoryIcon(category: PaymentCategory) {
    switch (category) {
      case PaymentCategory.Accommodation:
        return "bed";
      case PaymentCategory.Entertainment:
        return "game-controller";
      case PaymentCategory.FoodAndDrink:
        return "fast-food";
      case PaymentCategory.Transfer:
        return "airplane";
      default:
        return "infinite";
    }
  }
}
