import {Injectable} from '@angular/core';
import {Journey} from '../data/Journey';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {CrudHandler} from './helper/CRUD-Handler';
import {User} from '../data/User';
import {Payment} from '../data/Payment';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public journeyCrudHandler: CrudHandler<Journey>;
  public userCrudHandler: CrudHandler<User>;
  public paymentCrudHandler: CrudHandler<Payment>;

  constructor(public firestore: AngularFirestore) {
    this.journeyCrudHandler = new CrudHandler<Journey>(firestore, 'Journey');
    this.userCrudHandler = new CrudHandler<User>(firestore, 'User');
    this.paymentCrudHandler = new CrudHandler<Payment>(firestore, 'Payment');
  }


  public async getJoinedJourneys(userId: string): Promise<Journey[]> {
    return this.journeyCrudHandler.collection.ref.where('journeyParticipants', 'array-contains', userId).get()
      .then(snapshot => snapshot.docs.map(doc => {
        const journey = doc.data();
        journey.id = doc.id;
        return journey;
      }))
      .catch(error => Promise.reject(error));
  }

  public async getJourneyByInviteCode(inviteCode: string): Promise<Journey> {
    return this.journeyCrudHandler.collection.ref.where('inviteCode', '==', inviteCode).get()
      .then(snapshot => {
        if (snapshot.empty) {
          return Promise.reject('Invalid invite code.');
        }
        const doc = snapshot.docs[0];
        const journey = doc.data();
        journey.id = doc.id;
        return journey;
      });
  }


  public async addUserToJourney(journey: Journey, userId: string): Promise<string> {
    if (!userId || !journey.id) {
      return Promise.reject('Invalid parameters');
    }
    if (journey.journeyParticipants.includes(userId)) {
      return Promise.reject('User already joined journey');
    } else {
      journey.journeyParticipants.push(userId);
      return this.journeyCrudHandler.update(journey);
    }
  }

  public async isInviteCodeValid(inviteCode: string): Promise<boolean> {
    return !!await this.journeyCrudHandler.collection.ref.where('inviteCode', '==', inviteCode).get();
  }

  public async generateInviteCode(): Promise<string> {
    // generates a random 6-digit number and checks if it is already used
    let inviteCode = Math.floor(100000 + Math.random() * 900000).toString();
    while (!await this.isInviteCodeValid(inviteCode)) {
      inviteCode = Math.floor(100000 + Math.random() * 900000).toString();
    }
    return inviteCode;
  }
}
