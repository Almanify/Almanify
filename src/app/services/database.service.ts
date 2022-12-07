import {Injectable} from '@angular/core';
import {Journey} from "../data/Journey";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {copyAndPrepare} from "./../helper/copyAndPrepare";


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private journeyCollection: AngularFirestoreCollection<Journey>;


  constructor(public firestore: AngularFirestore) {
    this.journeyCollection = firestore.collection<Journey>('Journey');
  }

  public async persist(item: Journey): Promise<String> {
    return this.journeyCollection.add(copyAndPrepare(item))
      .then(document_refernce => {
        return document_refernce.id
      })
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
}
