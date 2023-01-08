
import {Injectable} from '@angular/core';
import {request} from "https";
import {getMessaging} from "firebase/messaging";
import firebase from "firebase/compat";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Messaging} from "@angular/fire/messaging";
import {environment} from "../../environments/environment";
import {initializeApp} from "@angular/fire/app";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {key, options} from "ionicons/icons";
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {HttpOptions} from "@capacitor/core";


@Injectable({
  providedIn: 'root'
})
export class PushMessegingService {
  constructor(private http: HttpClient) {
  }

  API_KEY: string = '1:705714006959:android:d9c4314823c35f63021d5a'; //shouldn't be in client, but we dont have a real backend so...

  /*  // Initialize Firebase
    app = initializeApp(environment.firebaseConfig);


    // Initialize Firebase Cloud Messaging and get a reference to the service
    messaging = getMessaging(this.app);*/

  sendNotificationToUser(targetUserID: string, debtorUserName: string, value: string) {
    const urlString = 'https://fcm.googleapis.com/fcm/send';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'key=' + this.API_KEY
      })
    }
    let body = {
      to: "/topic/" + targetUserID,
      notification: {
        title: 'Offene Schulden',
        body: "Du schuldest" + debtorUserName + " noch" + value
      },
      webpush:{
        headers:{
          imag: 'https://m.media-amazon.com/images/I/71bVEGMBolS._AC_UL1500_.jpg'
        }
      }
    }

    this.http.post(urlString, body, options)

    /*    const notification: admin.messaging.Notification = this.createDebtNotification('testiBert', "36.95")
        const payload: admin.messaging.Message = {
          notification,
          webpush:{
            headers:{
              imag: 'https://m.media-amazon.com/images/I/71bVEGMBolS._AC_UL1500_.jpg'
            }
          },
          topic: targetUserID
        }
        return admin.messaging().send(payload)*/
  }

  createDebtNotification(debtorUserName: string, value: string): admin.messaging.Notification {
    return {
      title: 'Offene Schulden',
      body: debtorUserName + 'erinnert dich daran, dass du ihm noch' + value + 'schuldest'
    }
  }

  subscribeToTopic = functions.https.onCall(async (data, context) => {
    await admin.messaging().subscribeToTopic(data.token, data.topic);
  });

  unsubscribeToTopic = functions.https.onCall(
    async (data, context) => {
      await admin.messaging().unsubscribeFromTopic(data.token, data.topic);
    });
}

