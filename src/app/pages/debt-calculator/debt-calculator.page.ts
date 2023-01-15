import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Journey} from '../../data/Journey';
import {DatabaseService} from '../../services/database.service';
import {Payment} from '../../data/Payment';
import {User} from '../../data/User';
import {AuthenticationService} from '../../services/auth.service';
import {convertFromCurrency, convertToCurrency, formatCurrency} from '../../services/helper/currencies';
import {NavController} from '@ionic/angular';
import {PushMessagingService} from '../../services/push-messaging.service';
import {currencies} from '../../services/helper/currencies';

@Component({
  selector: 'app-debt-calculator',
  templateUrl: './debt-calculator.page.html',
  styleUrls: ['./debt-calculator.page.scss'],
})
export class DebtCalculatorPage implements OnInit {

  userID = '';
  userIsOwed = 0;
  people: Array<User> = [];
  journey: Journey;
  payments: Payment[];
  convertToCurrency = convertToCurrency;
  isLoaded = false;
  selectedCurrency: string;
  currencies = currencies;
  owedBy = [];
  owedByString = '';

  /*
   * we store the debts as a map of the form, where person1 is the person who paid and person2 is the person who owes
   * key: 'person1-person2'
   * value: amount
   * (the key cannot be an array because using an array as a key would not work)
   */
  amountsToBePaid: Map<string, number> = undefined;
  amountsToBePaidByUser: Array<[string, number]> = undefined;

  constructor(route: ActivatedRoute,
              public databaseService: DatabaseService,
              public authenticationService: AuthenticationService,
              public navCtrl: NavController,
              public pushMessagingService: PushMessagingService) {
    this.journey = new Journey();
    this.journey.id = route.snapshot.paramMap.get('id');

    this.amountsToBePaid = new Map();
    this.amountsToBePaidByUser = [];
  }

  async loadJourney() {
    await this.databaseService.journeyCrudHandler.readByID(this.journey.id).then(async journey => {
      this.journey = journey;
      await this.loadParticipants(journey).then(() => this.loadPayments(journey));
      await this.getUserCurrency();
    });
  }

  async loadPayments(journey: Journey) {
    await this.databaseService.getJourneyPayments(journey.id).then(async payments => {
      this.payments = payments;
      await this.updateDebts();
    });
  }

  async loadParticipants(journey: Journey) {
    await journey.journeyParticipants
      .forEach(participant => this.databaseService.userCrudHandler
        .readByID(participant)
        .then((u) => {
          this.people.push(u);
        }));
  }

  async getUserCurrency() {
    await this.databaseService.userCrudHandler.readByID(this.userID).then(user => {
      this.selectedCurrency = user.userCurrency;
    });
  }


  resolveUserId(id: string) {
    return this.people.find(person => person.id === id)?.userName ?? 'Unknown';
  }

  toSelectedCurrencyString(amount: number) {
    return formatCurrency(convertToCurrency(amount, this.selectedCurrency), this.selectedCurrency);
  }

  async ngOnInit(): Promise<void> {
    this.authenticationService.expectUserId().then(id => {
      this.userID = id;
      this.loadJourney().then(() => this.isLoaded = true);
    });
  }

  getTotalAmountPaidByUser() {
    let total = 0;
    this.amountsToBePaidByUser.forEach((value) => {
      total += value[1];
    });
    return total;
  }

  payDebt(person: string, amount: number) {
    this.navCtrl.navigateForward('/payment-details/' + true + '/' + this.journey.id + '/' + person + '/'
      + convertToCurrency(amount, this.selectedCurrency) + '/' + this.selectedCurrency);
  }

  insertRepaidDebt() {
    this.navCtrl.navigateForward('/payment-details/' + true + '/' + this.journey.id + '/' + this.userID + '/' + 0);
  }

  private updateDebts() {
    const basicAmounts = new Map();

    this.payments.forEach(payment => {
      const amountInUSD = convertFromCurrency(payment.value, payment.currency);
      const amountPerPerson = amountInUSD / payment.paymentParticipants.length;

      payment.paymentParticipants.forEach(debtor => {

        // debtor is the same as the person who paid
        if (payment.payerID === debtor) {
          return;
        }

        const key = payment.payerID + '-' + debtor;

        const existingAmount = basicAmounts.get(key) || 0;
        basicAmounts.set(key, existingAmount + amountPerPerson);
      });
    });

    // map person indices to amount to be paid or received
    const moneyOffset = new Map();
    basicAmounts.forEach((amount, key) => {
      const [paidBy, paidFor] = key.split('-');
      moneyOffset.set(paidBy, (moneyOffset.get(paidBy) || 0) + amount);
      moneyOffset.set(paidFor, (moneyOffset.get(paidFor) || 0) - amount);
    });

    // sort by amount to be paid or received
    const sortedMoneyOffset: Array<[string, number]> = [...moneyOffset.entries()]
      .sort((a, b) => b[1] - a[1])
      .filter(([_, amount]) => amount !== 0);

    // calculate the final amounts to be paid
    const finalAmountsToBePaid = new Map();
    while (sortedMoneyOffset.length > 0) {
      // eslint-disable-next-line prefer-const
      let [person1, amount1] = sortedMoneyOffset.shift();
      while (amount1 > 0 && sortedMoneyOffset.length > 0) {
        // eslint-disable-next-line prefer-const
        let [person2, amount2] = sortedMoneyOffset.pop(); // highest debt

        const amountToBePaid = Math.min(amount1, -amount2);
        const key = person1 + '-' + person2;
        finalAmountsToBePaid.set(key, amountToBePaid);

        amount2 += amountToBePaid;
        amount1 -= amountToBePaid;

        if (amount2 !== 0) {
          sortedMoneyOffset.push([person2, amount2]);
        }
      }
    }

    // round to 2 decimal places
    finalAmountsToBePaid.forEach((value, key) => {
      finalAmountsToBePaid.set(key, Math.round(value * 100) / 100);
    });

    // we filter due payments below 10 cents
    this.amountsToBePaid = new Map([...finalAmountsToBePaid.entries()].filter(([_, amount]) => amount > 0.1));

    // filter out the debts that are not relevant to the user

    this.userIsOwed = 0;
    this.amountsToBePaidByUser = [];
    let owedByIds = [];
    this.amountsToBePaid.forEach((value, key) => {
      const [person1, person2] = key.split('-');
      if (person2 === this.userID) {
        this.amountsToBePaidByUser.push([person1, value]);
        this.amountsToBePaid.delete(key);
      } else if (person1 === this.userID) {
        this.userIsOwed += value;
        owedByIds.push([person2, value]);
      }
    });
    owedByIds.forEach((user, value) => this.databaseService.userCrudHandler
      .readByID(user)
      .then((u) => {
        this.owedBy.push([user, u.userName, value]);
      }));
    this.owedByString = this.owedBy.map((a) => a[1]).join(', ');
  }

  sendReminder() {
    this.owedBy.forEach(item => {
      this.pushMessagingService
        .sendNotificationToUser(item.userID, this.resolveUserId(this.userID), this.toSelectedCurrencyString(item.value))
    });
  }
}
