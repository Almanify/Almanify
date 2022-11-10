import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-debt-calculator',
  templateUrl: './debt-calculator.page.html',
  styleUrls: ['./debt-calculator.page.scss'],
})
export class DebtCalculatorPage implements OnInit {

  people: Array<string> = undefined;

  debt: {
    amount: number;
    paidBy: number;
    paidFor: Array<number>;
  } = undefined;

  debts: Array<{
    amount: number;
    paidBy: number;
    paidFor: Array<number>;
  }> = undefined;

  /*
   * we store the debts as a map of the form, where person1 is the person who paid and person2 is the person who owes
   * key: 'person1-person2'
   * value: amount
   * (the key cannot be an array because using an array as a key would not work)
   */
  amountsToBePaid: Map<string, number> = undefined;

  constructor() {
    this.people = [
      'Bob',
      'Sally',
      'John',
      'Jane'
    ];

    this.debt = {
      amount: 0,
      paidBy: undefined,
      paidFor: []
    };

    this.debts = [];
    this.amountsToBePaid = new Map();
  }

  addDebt() {
    this.debts.push(this.debt);
    this.debt = {
      amount: 0,
      paidBy: undefined,
      paidFor: []
    };
    this.updatePeopleOwages();
  }

  removeDebt(debt) {
    this.debts.splice(this.debts.indexOf(debt), 1);
    this.updatePeopleOwages();
  }

  updatePeopleOwages() {
    const basicAmounts = new Map();

    this.debts.forEach(debt => {
      const amountPerPerson = debt.amount / debt.paidFor.length;
      debt.paidFor.forEach(debtor => {

        // debtor is the same as the person who paid
        if (debt.paidBy === debtor) {
          return;
        }

        const key = debt.paidBy + '-' + debtor;

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
    const sortedMoneyOffset: Array<[number, number]> = [...moneyOffset.entries()]
      .sort((a, b) => b[1] - a[1])
      .filter(([_, amount]) => amount !== 0);

    console.log(sortedMoneyOffset);

    // calculate the final amounts to be paid
    const finalAmountsToBePaid = new Map();
    while (sortedMoneyOffset.length > 0) {
      let [person1, amount1] = sortedMoneyOffset.shift();
      while (amount1 > 0) {
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

    console.log(this.amountsToBePaid);
  }

  getPeople(indexArr) {
    return indexArr.map(i => this.people[i]).join(', ');
  }

  ngOnInit() {
  }

}
