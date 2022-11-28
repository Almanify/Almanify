export class Payment {
  public id: string;
  public title: string;
  public payerID: string;
  public value: number;
  public currency: string;
  public payday: Date;
  public category: PaymentCategory;
  public involvedIDs: Array<string>;
  public img: string;

  constructor(id: string,
              title: string,
              payerID: string,
              value: number,
              currency: string,
              payday: Date,
              category: PaymentCategory,
              involvedIDs: Array<string>,
              img: string = undefined) {
    this.id = id;
    this.title = title;
    this.payerID = payerID;
    this.value = value;
    this.currency = currency;
    this.payday = payday;
    this.category = category;
    this.involvedIDs = involvedIDs;
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
