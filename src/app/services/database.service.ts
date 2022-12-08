import {Injectable} from '@angular/core';
import {Journey} from '../data/Journey';
import {JourneyParticipation} from '../data/JourneyParticipation';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {copyAndPrepare} from '../helper/copyAndPrepare';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private journeyCollection: AngularFirestoreCollection<Journey>;
  private jParticipantsCollection: AngularFirestoreCollection<JourneyParticipation>;


  constructor(public firestore: AngularFirestore) {
    this.journeyCollection = firestore.collection<Journey>('Journey');
    this.jParticipantsCollection = firestore.collection<JourneyParticipation>('Journey_Participants');
  }

  public async persist(item: Journey | JourneyParticipation): Promise<string> {
    switch (item.constructor) {
      case Journey:
        return this.journeyCollection.add(copyAndPrepare(item))
          .then(documentReference => {return documentReference.id});
      case   JourneyParticipation:
        return this.jParticipantsCollection.add(copyAndPrepare(item))
          .then(documentReference => {return documentReference.id});
    }
  }

  public async getJourneys(): Promise<Journey[]> {
    return this.journeyCollection.get()
      .toPromise()
      .then(snapshot => snapshot.docs.map(doc => {
        const journey = doc.data();
        journey.id = doc.id;
        return journey;
      }))
      .catch(error => Promise.reject(error));
  }

  public async getJourneyParticipants(): Promise<JourneyParticipation[]> {
    return this.jParticipantsCollection.get()
      .toPromise()
      .then(snapshot => snapshot.docs.map(doc => doc.data()));
  }

  public async getJourneyParticipantsByJourneyId(journeyId: string): Promise<JourneyParticipation[]> {
    return this.jParticipantsCollection.ref.where('journeyID', '==', journeyId).get()
      .then(snapshot => snapshot.docs.map(doc => doc.data()));
  }

  public async getJourneyParticipantsByUserId(userId: string): Promise<JourneyParticipation[]> {
    return this.jParticipantsCollection.ref.where('userID', '==', userId).get()
      .then(snapshot => snapshot.docs.map(doc => doc.data()));
  }

  public async getJourneyById(journeyId: string): Promise<Journey> {
    return this.journeyCollection.doc(journeyId).get()
      .toPromise()
      .then(doc => {
        if (!doc.exists) {
          return Promise.reject('No journey found');
        }
        const journey = doc.data();
        journey.id = doc.id;
        return journey;
      })
      .catch(error => Promise.reject(error));
  }

  public async getJoinedJourneys(userId: string): Promise<Journey[]> {
    const joinedJourneys: Journey[] = [];
    const journeyParticipants = await this.getJourneyParticipantsByUserId(userId);
    for (const journeyParticipant of journeyParticipants) {
      const journey = await this.getJourneyById(journeyParticipant.journeyID);
      joinedJourneys.push(journey);
    }
    return joinedJourneys;
  }

  public async getCreatedJourneys(userId: string): Promise<Journey[]> {
    return this.journeyCollection.ref.where('userID', '==', userId).get()
      .then(snapshot => snapshot.docs.map(doc => {
        const journey = doc.data();
        journey.id = doc.id;
        return journey;
      }))
      .catch(error => Promise.reject(error));
  }

  public async getJourneyByInviteCode(inviteCode: string): Promise<Journey> {
    return this.journeyCollection.ref.where('inviteCode', '==', inviteCode).get()
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

  public async isJourneyParticipant(journeyId: string, userId: string): Promise<boolean> {
    return this.getJourneyParticipantsByJourneyId(journeyId)
      .then(value => value.some(value1 => value1.userID === userId))
      .catch(error => Promise.reject(error));
  }

  public async addUserToJourney(journeyId: string, userId: string): Promise<string> {
    const journeyParticipant: JourneyParticipation = new JourneyParticipation(userId, journeyId);
    if (!await this.getJourneyById(journeyId)) {
      return Promise.reject('No journey found');
    } else if (await this.isJourneyParticipant(journeyId, userId)) {
      return Promise.reject('User already joined journey');
    } else {
      return this.persist(journeyParticipant);
    }
  }
}
