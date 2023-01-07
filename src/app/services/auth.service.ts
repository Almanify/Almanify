//copy-past from qapp

// https://firebase.google.com/docs/auth/web/password-auth
// https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/ (outdated)
// https://devdactic.com/ionic-5-navigation-with-login/ (outdated)


import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {BehaviorSubject, Observable, Observer} from 'rxjs';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {

  observer: Observer<string>;
  observable: Observable<string> = new Observable(observer => this.observer = observer);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  private mail = '';
  private userId = '';

  constructor(public angularFireAuth: AngularFireAuth) {
    this.angularFireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.isAuthenticated.next(true);
        this.userId = user.uid;
        this.mail = user.email;
        this.observer.next(user.uid); //changed to from email to uid
      } else {
        this.isAuthenticated.next(false);
        this.userId = '';
        this.mail = '';
        this.observer.next('');
      }
    });
  }


  get getUserEmail(): string {
    return this.mail;
  }


  get getUserId(): string {
    return this.userId;
  }


  async signIn(email: string, password: string, rememberMe: boolean) {
    await this.angularFireAuth.setPersistence(rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION);
    return await this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }


  signOut() {
    return this.angularFireAuth.signOut();
  }

  public getObservable() {
    return this.observable;
  }

}
