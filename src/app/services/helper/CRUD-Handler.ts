import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {copyAndPrepare} from "./copyAndPrepare";
import {DatabaseEntity} from "../../data/DatabaseEntity";
import {EntityWithMultipleForeignKeys} from "../../data/EntityWithMultipleForeignKeys";


class CRUD_Handler<Entity extends DatabaseEntity> {
  private entityCollection: AngularFirestoreCollection<DatabaseEntity>;

  constructor(public firestore: AngularFirestore, path: string) {
    this.firestore = firestore;
    this.entityCollection = firestore.collection<Entity>(path);
  }

  public async creatAndGetID(entity: DatabaseEntity): Promise<string> {
    return this.entityCollection.add(copyAndPrepare(entity))
      .then(documentReference => {
        return documentReference.id
      });
  }

  public async updateByID(entity: Entity): Promise<string>{
    this.checkEntityHasID(entity);
    return  this.entityCollection.doc(entity.id).update(copyAndPrepare(entity)).then(() => {
      return entity.id
    });
  }

  public async readByID(entity: Entity): Promise<any>{
    this.checkEntityHasID(entity);
    return this.entityCollection.doc(entity.id).get();
  }


  public async deleteByID(entity: Entity): Promise<any>{
    this.checkEntityHasID(entity);
    return this.entityCollection.doc(entity.id).delete()
  }

  private checkEntityHasID(entity: Entity){
    if (entity.id === undefined){
      throw new Error("Entity has no id");
    }
  }

}
