import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {copyAndPrepare} from './copyAndPrepare';
import {DatabaseEntity} from '../../data/DatabaseEntity';
import {Observable} from 'rxjs/internal/Observable';

export class CrudHandler<Entity extends DatabaseEntity> {
  public collection: AngularFirestoreCollection<Entity>;

  constructor(public firestore: AngularFirestore, public path: string) {
    this.firestore = firestore;
    this.collection = firestore.collection<Entity>(path);
  }

  public async createAndGetID(entity: Entity): Promise<string> {
    return this.collection.add(copyAndPrepare(entity))
      .then(documentReference => documentReference.id);
  }

  public async update(entity: Entity): Promise<string> {
    return this.collection.doc(entity.id).update(copyAndPrepare(entity)).then(() => entity.id);
  }


  public async read(entity: Entity): Promise<Entity> {
    return this.readByID((entity.id));
  }

  public async readByID(id: string): Promise<Entity> {
    try {
      return this.collection.doc(id).get()
        .toPromise()
        .then(entry => {
          if (!entry.exists) {
            return Promise.reject('No Entry found');
          }
          const out = entry.data();
          out.id = entry.id;
          return out;
        })
        .catch(error => Promise.reject(error));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public async delete(entity: Entity) {
    await this.collection.doc(entity.id).delete();
  }

  public getObserver(id: string): Observable<any> {
    return this.collection.doc(id).snapshotChanges();
  }

}
