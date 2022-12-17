import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Payment, PaymentCategory} from 'src/app/data/Payment';
import {ActivatedRoute} from '@angular/router';
import {User} from "../../data/User";
import {Journey} from "../../data/Journey";
import {DatabaseService} from "../../services/database.service";
import {AuthenticationService} from "../../services/auth.service";
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {ActionSheetController} from "@ionic/angular";

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.page.html',
  styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage implements OnInit {

  journey: Journey
  payment: Payment;
  users: Array<User> = [];
  currencies: Array<string> = undefined;
  categories: PaymentCategory[];
  userIdMap: Map<string, User> = new Map;
  isEditMode = false;

  constructor(private activatedRoute: ActivatedRoute,
              private databaseService: DatabaseService,
              public authService: AuthenticationService,
              private actionSheetCtrl: ActionSheetController) {
    this.journey = new Journey();
    this.payment = new Payment();
    this.isEditMode = JSON.parse(this.activatedRoute.snapshot.paramMap.get('editmode')); //TODO prüfen ob user das darf
    this.journey.id = this.activatedRoute.snapshot.paramMap.get('journeyId');
    this.payment.id = this.activatedRoute.snapshot.paramMap.get('paymentId');
    this.databaseService.journeyCrudHandler.read(this.journey).then(
      (journey) => {
        this.journey = journey;
        if (this.payment.id !== null) {
          //existing payment
          this.databaseService.paymentCrudHandler.read(this.payment).then((payment) => {
            this.payment = payment;
          });
          this.getJourneyParticipants(journey);
        } else {
          //new payment
          this.payment = new Payment(
            '',
            '',
            this.authService.getUserId,
            this.journey.id,
            undefined,
            this.journey.defaultCurrency,
            Timestamp.fromDate(new Date()))
        }
        this.getJourneyParticipants(this.journey);
      });


    this.currencies = [
      '€',
      '$',
      '🍑'
    ];
    this.categories = Object.values(PaymentCategory);
    console.log(this.users);
  }

  getNotInvolvedUsers(): User[] {
    return this.users.filter(journeyParticipants => !this.payment.paymentParticipants.includes(journeyParticipants.id));
  }

  updatePayday(value) {
    this.payment.payday = Timestamp.fromDate(new Date(value));
    console.log(this.payment);
  }

  ngOnInit() {
    if (this.payment.id === null) {
      this.payment.payerID = this.authService.getUserId;
      this.authService.getObservable().subscribe((u) => { // subscribe to changes
        this.payment.payerID = u;
      });
    }
  }

  getJourneyParticipants(journey: Journey) {
    journey.journeyParticipants
      .forEach(participant => this.databaseService.userCrudHandler
        .readByID(participant)
        .then((u) => {
          this.users.push(u);
          this.userIdMap.set(u.id, u);
        }));
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.save();
    }
  }

  save() {
    //save stuff
    console.log(this.payment)
    console.log('saved');
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Add user to the payment',
      subHeader: 'Click on a user who has caused expenses.',
      buttons: this.createButtons()
    });
    await actionSheet.present();
  }

  createButtons() {
    let buttons = [];
    let users = this.getNotInvolvedUsers();
    if (0 < users.length) {
      let allButton = {
        text: 'Add All',
        icon: 'People',
        handler: () => users.forEach(user => this.payment.paymentParticipants.push(user.id))
      };
      buttons.push(allButton);
    }
    for (let user of users) {
      let button = {
        text: user.userName,
        icon: 'Person',
        handler: () => {
          this.payment.paymentParticipants.push(user.id)
        }
      };
      buttons.push(button);
    }
    return buttons;
  }

  removeInvolved(userID: string) {
    const index = this.payment.paymentParticipants.indexOf(userID);
    this.payment.paymentParticipants.splice(index, 1);
  }


}
