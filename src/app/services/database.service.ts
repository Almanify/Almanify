import {Injectable} from '@angular/core';
import {Journey} from "../data/Journey";
import {Journey_Participants} from "../data/Journey_Participants";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {copyAndPrepare} from "./../helper/copyAndPrepare";


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private journeyCollection: AngularFirestoreCollection<Journey>;
  private jParticipantsCollection: AngularFirestoreCollection<Journey_Participants>


  constructor(public firestore: AngularFirestore) {
    this.journeyCollection = firestore.collection<Journey>('Journey');
    this.jParticipantsCollection = firestore.collection<Journey_Participants>('Journey_Participants')
  }

  public async persist(item: Journey | Journey_Participants): Promise<String> {
    switch (item.constructor) {
      case
      Journey:
        return this.journeyCollection.add(copyAndPrepare(item))
          .then(document_refernce => {
            return document_refernce.id
          });
      case   Journey_Participants:
        return this.jParticipantsCollection.add(copyAndPrepare(item))
          .then(document_refernce => {
            return document_refernce.id;
          })
    }
  }

  public async readJourney(): Promise<Journey[]> {
    return this.journeyCollection.get()
      .toPromise()
      .then(snapshot => snapshot.docs.map(doc => {
        const journey = doc.data();
        journey.id = doc.id;
        return journey;
      }))
      .catch(error => {
        console.log(error);
        return null;
      })
  }

  public async readJParticipants(): Promise<Journey_Participants[]> {
    return this.jParticipantsCollection.get()
      .toPromise()
      .then(snapshot => snapshot.docs.map(doc => {
        const jParticipant = doc.data();
        //journey.id = doc.id;
        return jParticipant;
      }))
      .catch(error => {
        console.log(error);
        return null;
      })
  }
}
