//copy-past from qapp

// https://firebase.google.com/docs/auth/web/password-auth
// https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/ (outdated)
// https://devdactic.com/ionic-5-navigation-with-login/ (outdated)


import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {BehaviorSubject, Observable, Observer} from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class AuthentificationService {

  observer: Observer<string>;
  observable: Observable<string> = new Observable(observer => this.observer = observer);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  private user: string = "";
  private user_id: string = "";

  constructor(public angularFireAuth: AngularFireAuth) {
    this.angularFireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.isAuthenticated.next(true);
        this.user_id = user.uid;
        this.user = user.email;
        this.observer.next(user.email);
      } else {
        this.isAuthenticated.next(false);
        this.user_id = "";
        this.user = "";
        this.observer.next("");
      }
    });
  }


  get user_email(): string {
    return this.user;
  }


  get user_user_id(): string {
    return this.user_id;
  }


  signIn(email: string, password: string, rememberMe: boolean) {
    this.angularFireAuth.setPersistence(rememberMe ? 'local' : 'session');
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }


  signOut() {
    return this.angularFireAuth.signOut();
  }

  public getObservable() {
    return this.observable;
  }

}
