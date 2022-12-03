export class User {
    public userID: string;
    public eMail: string;
    public userCurrency: string; //TODO
    public userName: string;
 
  constructor(userID: string,
    eMail: string,
    userCurrency: string,
    userName: string) {

    this.userID = userID;
    this.eMail = eMail;
    this.userCurrency = userCurrency;
    this.userName = userName;
    }

}