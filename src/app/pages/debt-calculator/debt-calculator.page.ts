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
    route.url.subscribe(() => {
      if(this.journey && this.isLoaded) { // if the page is already loaded, we need to reload the journey
        this.payments = [];
        this.owedBy = [];
        this.loadPayments(this.journey);
      }
    });

    this.journey = new Journey();
    this.journey.id = route.snapshot.paramMap.get('id');

    this.amountsToBePaid = new Map();
    this.amountsToBePaidByUser = [];
  }

  /**
   * Load the journey and call the functions to load the participants and payments
   */
  async loadJourney() {
    await this.databaseService.journeyCrudHandler.readByID(this.journey.id).then(async journey => {
      this.journey = journey;
      await this.loadParticipants(journey).then(() => this.loadPayments(journey));
      await this.getUserCurrency();
    });
  }

  /**
   * Load the payments and then update the debts
   *
   * @param journey the journey for which the payments should be loaded
   */
  async loadPayments(journey: Journey) {
    await this.databaseService.getJourneyPayments(journey.id).then(async payments => {
      this.payments = payments;
      await this.updateDebts();
    });
  }

  /**
   * Load participants of the journey
   *
   * @param journey the journey for which the participants should be loaded
   */
  async loadParticipants(journey: Journey) {
    await journey.journeyParticipants
      .forEach(participant => this.databaseService.userCrudHandler
        .readByID(participant)
        .then((u) => {
          this.people.push(u);
        }));
  }

  /**
   * Get the currency of the user
   */
  async getUserCurrency() {
    await this.databaseService.userCrudHandler.readByID(this.userID).then(user => {
      this.selectedCurrency = user.userCurrency;
    });
  }

  /**
   * Get the name of a user by their id
   *
   * @param id the id of the user
   */
  resolveUserId(id: string) {
    return this.people.find(person => person.id === id)?.userName ?? 'Unknown';
  }

  /**
   * Convert the amount to the selected currency
   *
   * @param amount the amount to be converted
   */
  toSelectedCurrencyString(amount: number) {
    return formatCurrency(convertToCurrency(amount, this.selectedCurrency), this.selectedCurrency);
  }

  /**
   * Angular lifecycle hook that is called when the page is loaded
   */
  async ngOnInit(): Promise<void> {
    this.authenticationService.expectUserId().then(id => {
      this.userID = id;
      this.loadJourney().then(() => this.isLoaded = true);
    });
  }

  /**
   * Get the total amount that the user has to pay
   */
  getTotalAmountPaidByUser() {
    let total = 0;
    this.amountsToBePaidByUser.forEach((value) => {
      total += value[1];
    });
    return total;
  }

  /**
   * Send the user to the payment details page to mark a debt of his as paid
   *
   * @param person the person the user has to pay
   * @param amount the amount the user has to pay (will be filled in automatically)
   */
  async payDebt(person: string, amount: number) {
    await this.navCtrl.navigateForward('/payment-details/' + true + '/' + this.journey.id + '/' + person + '/'
      + convertToCurrency(amount, this.selectedCurrency) + '/' + this.selectedCurrency);
  }

  /**
   * Send the user to the payment details page to mark a debt of someone else as paid
   *
   * @param person the person who paid
   * @param amount the amount the person paid (will be filled in automatically)
   */
  async insertRepaidDebt(person?: string, amount?: number) {
    if (person && amount) {
      await this.navCtrl.navigateForward('/payment-details/' + true + '/' + this.journey.id + '/' + this.userID + '/'
        + amount + '/' + this.selectedCurrency + '/' + person);
    } else {
      await this.navCtrl.navigateForward('/payment-details/' + true + '/' + this.journey.id + '/' + this.userID + '/' + 0);
    }
  }

  /**
   * Send reminders to all users who owe money to the user
   */
  sendReminder() {
    this.owedBy.forEach(item => {
      const id = item[0];
      const value: number = item[2];
      const currency: string = item[3];
      this.pushMessagingService
        .sendNotificationToUser(id, this.resolveUserId(this.userID), formatCurrency(convertToCurrency(value, currency), currency));
    });
  }

  /**
   * Calculate the debts between all users
   *
   * @private
   */
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
    const owedByIds = [];

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

    owedByIds.forEach(
      ([userId, value]) => this.databaseService.userCrudHandler
        .readByID(userId)
        .then((u) => {
          this.owedBy.push([userId, u.userName, value, u.userCurrency]);
        }));
  }
}
