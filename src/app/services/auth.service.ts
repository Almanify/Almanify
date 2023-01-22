//copy-past from qapp

// https://firebase.google.com/docs/auth/web/password-auth
// https://www.positronx.io/ionic-firebase-authentication-tutorial-with-examples/ (outdated)
// https://devdactic.com/ionic-5-navigation-with-login/ (outdated)


import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {BehaviorSubject, Subject} from 'rxjs';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {

  userIdSubject: Subject<string> = new Subject<string>();
  // observable: Observable<string> = new Observable(observer => this.userIdSubject = observer);
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  private mail: string;
  private userId: string;

  constructor(public angularFireAuth: AngularFireAuth) {
    angularFireAuth.user.subscribe(user => {
      console.log('authService: user changed', user);
      if (user) {
        this.isAuthenticated.next(true); // user is logged in
        this.mail = user.email;
        this.userId = user.uid;
        this.userIdSubject.next(user.uid);
      } else {
        this.isAuthenticated.next(false);
        this.userIdSubject.next(null);
        this.mail = undefined;
        this.userId = undefined;
      }
    });
  }

  /**
   * Getter for the user email
   */
  get getUserEmail(): string {
    return this.mail;
  }

  /**
   * Returns a promise that resolves to the user id. If the user is already logged in, the promise resolves immediately.
   */
  async expectUserId(): Promise<string> {
    return this.userId ? this.userId : new Promise<string>(resolve => {
      this.userIdSubject.subscribe(userId => {
        if (userId) {
          resolve(userId);
        }
      });
    });
  }

  /**
   * Signs in the user with the given email and password
   *
   * @param email the email address
   * @param password the password
   * @param rememberMe whether the data should be stored locally or not
   */
  async signIn(email: string, password: string, rememberMe: boolean) {
    await this.angularFireAuth.setPersistence(rememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION);
    return await this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Signs the user out
   */
  async signOut() {
    await this.angularFireAuth.signOut();
    // we expect this to trigger angularFireAuth.user.subscribe
  }
}
