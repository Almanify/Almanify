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

  /**
   * Returns all payments for a journey
   *
   * @param journeyId the id of the journey
   */
  public async getJourneyPayments(journeyId: string): Promise<Payment[]> {
    return this.paymentCrudHandler.collection.ref.where('journeyID', '==', journeyId).get()
      .then(snapshot => snapshot.docs.map(doc => {
        const payment = doc.data();
        payment.id = doc.id;
        return payment;
      }))
      .catch(error => Promise.reject(error));
  }

  /**
   * Returns all journeys a user is part of
   *
   * @param userId the id of the user
   */
  public async getJoinedJourneys(userId: string): Promise<Journey[]> {
    return this.journeyCrudHandler.collection.ref.where('journeyParticipants', 'array-contains', userId).get()
      .then(snapshot => snapshot.docs.map(doc => {
        const journey = doc.data();
        journey.id = doc.id;
        return journey;
      }))
      .catch(error => Promise.reject(error));
  }

  /**
   * Returns the journey with the given invite code
   *
   * @param inviteCode the invite code of the journey
   */
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

  /**
   * Adds a user to a journey
   *
   * @param journey the journey to add the user to
   * @param userId the id of the user to add
   */
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

  /**
   * Checks if an invite code is valid
   *
   * @param inviteCode the invite code to check
   */
  public async isInviteCodeValid(inviteCode: string): Promise<boolean> {
    return !!await this.journeyCrudHandler.collection.ref.where('inviteCode', '==', inviteCode).get();
  }

  /**
   * Generates a random invite code that is not used yet
   */
  public async generateInviteCode(): Promise<string> {
    // generates a random 6-digit number and checks if it is already used
    let inviteCode = Math.floor(100000 + Math.random() * 900000).toString();
    while (!await this.isInviteCodeValid(inviteCode)) {
      inviteCode = Math.floor(100000 + Math.random() * 900000).toString();
    }
    return inviteCode;
  }
}
