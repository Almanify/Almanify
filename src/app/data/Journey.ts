import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {DatabaseEntity} from "./DatabaseEntity";

export class Journey implements DatabaseEntity {
  public id: string;
  public title: string;
  public defaultCurrency: string;
  public start: Timestamp;
  public end: Timestamp;
  public creatorID: string;
  public inviteCode: string;
  public journeyParticipants: string[];
  public active: boolean;

  constructor(
    id: string = '',
    name: string = '',
    creatorID: string = '',
    inviteCode: string = '',
    start: Timestamp = Timestamp.fromDate(new Date()),
    end: Timestamp = Timestamp.fromDate(new Date()),
    journeyParticipants: string[] = [],
    defaultCurrency: string = '€',
    active: boolean = true) {

    this.id = id;
    this.title = name;
    this.defaultCurrency = defaultCurrency;
    this.journeyParticipants = journeyParticipants;
    this.creatorID = creatorID;
    this.inviteCode = inviteCode;
    this.start = start;
    this.end = end;
    this.active = active;
  }
}

