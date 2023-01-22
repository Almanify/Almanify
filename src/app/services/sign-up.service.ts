import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {User} from '../data/User';
import {AlertController, ToastController} from '@ionic/angular';
import {copyAndPrepare} from './helper/copyAndPrepare';


@Injectable({
  providedIn: 'root'
})
export class SignUPService {
  private userCollection: AngularFirestoreCollection<User>;

  constructor(public firestore: AngularFirestore,
              private angularFireAuth: AngularFireAuth,
              private alertController: AlertController,
              private toastController: ToastController) {
    this.angularFireAuth = angularFireAuth;
    this.userCollection = firestore.collection<User>('User');
  }

  /**
   * Creates a new user in the database
   *
   * @param user the user object
   * @param email the email address
   * @param password the password
   */
  createUser(user: User, email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password)
      .then(async (data) => {
        user.id = data.user.uid;
        await this.userCollection.doc(user.id).set(copyAndPrepare(user) as User);   //important userdata and user login has same id
        await this.toastSuccessfullySignedUp();
      })
      .catch(async error => {
        await this.alertError(error.message);
      });
  }

  /**
   * Shows a toast that the user has successfully signed up
   */
  async toastSuccessfullySignedUp() {
    const toast = await this.toastController.create({
      message: 'Successfully signed up! You can now login and enjoy Almanify.',
      duration: 5000,
      position: 'top'
    });
    await toast.present();
  }

  /**
   * Shows an alert that something went wrong
   *
   * @param error the error message
   */
  async alertError(error: string) {
    const alert = await this.alertController.create({
      header: 'Something went wrong.',
      message: error,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
