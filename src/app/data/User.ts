export class User {
   id: string;
   userCurrency: string; //TODO
   userName: string;

  constructor(
    id: string,
    userName: string,
    userCurrency: string = '€') {

    this.id = id;
    this.userCurrency = userCurrency;
    this.userName = userName;
  }

}
