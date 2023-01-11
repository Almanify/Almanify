import {DatabaseEntity} from './DatabaseEntity';

export class User implements DatabaseEntity {
  id: string;
  userCurrency: string;
  userName: string;

  constructor(
    id: string = '',
    userName: string = '',
    userCurrency: string = '€') {

    this.id = id;
    this.userCurrency = userCurrency;
    this.userName = userName;
  }

}
