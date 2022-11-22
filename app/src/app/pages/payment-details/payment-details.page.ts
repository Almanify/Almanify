import {Component, OnInit} from '@angular/core';
import {Payment, PaymentCategory} from 'src/app/data/Payment';
import {save} from "ionicons/icons";

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.page.html',
  styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage implements OnInit {

  //vorlaeufig
  private journeyTitle: string = 'Exa_Journey_Name';
  private payment: Payment;
  private people: Array<string> = undefined;
  private currencys: Array<string> = undefined;
  private categorys;

  private isEditMode: boolean = false;

  constructor() {
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
      'Karl Heinz',
    ];
    this.currencys = [
      '€',
      '$',
      '🍑'
    ]
    this.payment = new Payment('1234', 'Exa_Payment', 'Hanz', 42.69, "€", new Date(2022, 10, 6), PaymentCategory.FoodAndDrink, this.people);


    this.categorys = Object.values(PaymentCategory)
  }

  ngOnInit() {
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode)
      this.save()
  }

  save() {
    //save stuff
    console.log("saved");
  }
}
