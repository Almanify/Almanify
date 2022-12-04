export class User {
   userID: string;
   userCurrency: string; //TODO
   userName: string;

  constructor(
    userID: string,
    userName: string,
    userCurrency: string = '€') {

    this.userID = userID;
    this.userCurrency = userCurrency;
    this.userName = userName;
  }

}
