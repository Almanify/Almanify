import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {User} from "../data/User";
import {addDoc, collection} from "@angular/fire/firestore";
import firebase from "firebase/compat";
import firestore = firebase.firestore;
import {AlertController, ToastController} from '@ionic/angular';
import {alert} from "ionicons/icons";
import {copyAndPrepare} from "./helper/copyAndPrepare";


@Injectable({
  providedIn: 'root'
})
export class SignUPService {
  private userCollection: AngularFirestoreCollection<User>

  constructor(public firestore: AngularFirestore, private angularFireAuth: AngularFireAuth, private alertController: AlertController, private toastController: ToastController) {
    this.angularFireAuth = angularFireAuth;
    this.userCollection = firestore.collection<User>('User')
  }


  createUser(user: User, email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password)
      .then((data) => {
        user.id = data.user.uid
        this.userCollection.doc(user.id).set(copyAndPrepare(user) as User)   //important userdata and user login has same id
        //this.alertSuccessfullySignUp();
        this.toastSuccssfullySignUp();
      })
      .catch(error => {
        this.alertError(error.message);
      });
  }

  async alertSuccessfullySignUp() {
    const alert = await this.alertController.create({
      header: 'Registration successful',
      message: 'You can login now and enjoy Almanify.',
      buttons: ['OK'],
    });

    await alert.present();
  }
  async toastSuccssfullySignUp(){
    const toast = await this.toastController.create({
      message: 'You can login now and enjoy Almanify.',
      duration: 5000,
      position: 'top'
    })
    await toast.present();
  }

  async alertError(error: string) {
    const alert = await this.alertController.create({
      header: 'Something is wrong',
      message: error + 'Pleas try again.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
