export class User {
   id: string;
   userCurrency: string; //TODO
   userName: string;

  constructor(
    userID: string,
    userName: string,
    userCurrency: string = '€') {

    this.id = userID;
    this.userCurrency = userCurrency;
    this.userName = userName;
  }

}
