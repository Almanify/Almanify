import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {User} from "../data/User";
import {addDoc, collection} from "@angular/fire/firestore";
import firebase from "firebase/compat";
import firestore = firebase.firestore;

@Injectable({
  providedIn: 'root'
})
export class SignUPService {
  private userCollection: AngularFirestoreCollection<User>

  constructor(public firestore: AngularFirestore, private angularFireAuth: AngularFireAuth) {
    this.angularFireAuth = angularFireAuth;
    this.userCollection = firestore.collection<User>('User')
  }


  //TODO one UserID and one Mail
  createUser(user: User, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(user.eMail, password)
      .then(() => {
        this.save(user);
      })
      .catch(error => {
        console.log('Something is wrong:', error.message);
      });
  }

  save(user: User) : Promise<String>{
    return this.userCollection.add(this.copyAndPrepare(user) as  User).then(document_reference => {
      return document_reference.id
    });
  }


  private copyAndPrepare(item) {
    const copy = {...item}
    delete copy.id;
    return copy;
  }
}
