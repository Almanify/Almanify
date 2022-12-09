import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

export class Journey {
  public id: string;
  public title: string;
  public defaultCurrency: string; //TODO
  public start: Timestamp;
  public end: Timestamp;
  public creatorID: string;
  public inviteCode: string;
  public active: boolean;

  constructor(
    journeyID: string,
    name: string,
    creatorID: string,
    inviteCode: string,
    start: Timestamp,
    end: Timestamp,
    defaultCurrency: string = '€',
    active: boolean = true) {

    this.id = journeyID;
    this.title = name;
    this.defaultCurrency = defaultCurrency;
    this.creatorID = creatorID;
    this.inviteCode = inviteCode;
    this.start = start;
    this.end = end;
    this.active = active;
  }
}

