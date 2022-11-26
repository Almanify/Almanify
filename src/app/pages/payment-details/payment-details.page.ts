import {Component, OnInit} from '@angular/core';
import {Payment, PaymentCategory} from 'src/app/data/Payment';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.page.html',
  styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage implements OnInit {

  journeyTitle: string = 'Exa_Journey_Name';
  payment: Payment;
  people: Array<string> = undefined;
  currencies: Array<string> = undefined;
  categories;

  isEditMode = false;

  constructor(route: ActivatedRoute) {
    route.queryParams.subscribe(params => {
      if (!params) {
        throw new Error('No params given');
      }
      this.payment = JSON.parse(params.payment);
      this.isEditMode = params.edit;
      this.people = JSON.parse(params.people);
    });

    this.currencies = [
      '€',
      '$',
      '🍑'
    ];
    this.categories = Object.values(PaymentCategory);
  }

  ngOnInit() {
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.save();
    }
  }

  save() {
    //save stuff
    console.log('saved');
  }

  removeInvolved(userID: string) {
    const index = this.payment.involvedIDs.indexOf(userID);
    this.payment.involvedIDs.splice(index, 1);
  }
}
