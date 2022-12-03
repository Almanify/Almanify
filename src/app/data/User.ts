import {IUser} from "./IUser";

export class User implements IUser{
   userID: string;
   eMail: string;
   userCurrency: string; //TODO
   userName: string;

  constructor(
    userID: string,
    eMail: string,
    userName: string,
    userCurrency: string = '€') {

    this.userID = userID;
    this.eMail = eMail;
    this.userCurrency = userCurrency;
    this.userName = userName;
  }

}
