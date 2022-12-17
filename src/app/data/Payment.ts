import {DatabaseEntity} from "./DatabaseEntity";
import Timestamp = firebase.firestore.Timestamp;
import firebase from 'firebase/compat/app';
export class Payment implements DatabaseEntity {
  public id: string;
  public title: string;
  public payerID: string;
  public journeyID: string;
  public value: number;
  public currency: string;
  public payday: Timestamp;
  public category: string;
  public paymentParticipants: string[];
  public img: string;


  constructor(id: string = '',
              title: string = '',
              payerID: string = '',
              journeyID: string = '',
              value: number = undefined,
              currency: string = '€',
              payday: Timestamp = Timestamp.fromDate(new Date()),
              category: PaymentCategory = PaymentCategory.Other,
              paymentParticipants: string[] = [],
              img: string = undefined) {

    this.id = id;
    this.title = title;
    this.payerID = payerID;
    this.journeyID = journeyID;
    this.value = value;
    this.currency = currency;
    this.payday = payday;
    this.category = category.toString();
    this.paymentParticipants = paymentParticipants;
    this.img = img;
  }


}

export enum PaymentCategory {
  Accommodation = 'Accommodation',
  FoodAndDrink = 'Food&Drink',
  Entertainment = 'Entertainment',
  Transfer = 'Transfer',
  Other = 'Other',
}
