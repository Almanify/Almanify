import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-debt-calculator',
  templateUrl: './debt-calculator.page.html',
  styleUrls: ['./debt-calculator.page.scss'],
})
export class DebtCalculatorPage implements OnInit {

  userID: string = undefined;
  userIsOwed = 0;
  currency = '€';
  people: Array<string> = undefined;

  debt: {
    value: number;
    payerID: number;
    involvedIDs: Array<number>;
  } = undefined;

  debts: Array<{
    value: number;
    payerID: number;
    involvedIDs: Array<number>;
  }> = undefined;

  /*
   * we store the debts as a map of the form, where person1 is the person who paid and person2 is the person who owes
   * key: 'person1-person2'
   * value: amount
   * (the key cannot be an array because using an array as a key would not work)
   */
  amountsToBePaid: Map<string, number> = undefined;
  amountsToBePaidByUser: Array<[string, number]> = undefined;

  constructor(route: ActivatedRoute) {
    this.userID = 'Bob';
    route.queryParams.subscribe(params => {
      if (!params) {
        this.debts = [];
        this.people = [
          'Bob',
          'Sally',
          'John',
          'Jane',
          'Mike',
          'Günter',
          'Hans'
        ];
        return;
      }

      if (params.payments) {
        this.debts = JSON.parse(params.payments);
      } else {
        this.debts = [];
      }

      if (params.people) {
        this.people = JSON.parse(params.people);
      } else {
        this.people = [
          'Bob',
          'Sally',
          'John',
          'Jane',
          'Mike',
          'Günter',
          'Hans'
        ];
      }

      this.updatePeopleOwages();
    });


    this.debt = {
      value: 0,
      payerID: undefined,
      involvedIDs: []
    };

    this.amountsToBePaid = new Map();
  }

  /* TODO:
   - convert all values to the same currency (USD)
   */

  addDebt() {
    this.debts.push(this.debt);
    this.debt = {
      value: 0,
      payerID: undefined,
      involvedIDs: []
    };
    this.updatePeopleOwages();
  }

  removeDebt(debt) {
    this.debts.splice(this.debts.indexOf(debt), 1);
    this.updatePeopleOwages();
  }

  getPeople(indexArr) {
    return indexArr.join(', ');
  }

  ngOnInit(): void {
  }

  private updatePeopleOwages() {
    const basicAmounts = new Map();

    this.debts.forEach(debt => {
      const amountPerPerson = debt.value / debt.involvedIDs.length;
      debt.involvedIDs.forEach(debtor => {

        // debtor is the same as the person who paid
        if (debt.payerID === debtor) {
          return;
        }

        const key = debt.payerID + '-' + debtor;

        const existingAmount = basicAmounts.get(key) || 0;
        basicAmounts.set(key, existingAmount + amountPerPerson);
      });
    });

    console.log(basicAmounts.entries());

    // remove bidirectional debts
    /*
    const newAmountsToBePaid = new Map();
    while (basicAmounts.size > 0) {
      const key = basicAmounts.keys().next().value;
      const amount = basicAmounts.get(key);

      const reverseKey = key.split('-').reverse().join('-');
      const reverseAmount = basicAmounts.get(reverseKey) || 0;
      if (amount > reverseAmount) {
        newAmountsToBePaid.set(key, amount - reverseAmount);
      } else if (amount < reverseAmount) {
        newAmountsToBePaid.set(reverseKey, reverseAmount - amount);
      }

      basicAmounts.delete(key);
      basicAmounts.delete(reverseKey);
    }
     */

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

    console.log(sortedMoneyOffset, sortedMoneyOffset[0]);

    // calculate the final amounts to be paid
    const finalAmountsToBePaid = new Map();
    while (sortedMoneyOffset.length > 0) {
      let [person1, amount1] = sortedMoneyOffset.shift();
      while (amount1 > 0 && sortedMoneyOffset.length > 0) {
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

    this.amountsToBePaid = finalAmountsToBePaid;

    // filter out the debts that are not relevant to the user

    this.userIsOwed = 0;
    this.amountsToBePaidByUser = [];
    this.amountsToBePaid.forEach((value, key) => {
      const [person1, person2] = key.split('-');
      if (person2 === this.userID) {
        this.amountsToBePaidByUser.push([person1, value]);
        this.amountsToBePaid.delete(key);
      } else if (person1 === this.userID) {
        this.userIsOwed += value;
      }
    });
  }
}
