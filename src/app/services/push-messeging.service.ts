
import {Injectable} from '@angular/core';
import * as admin from 'firebase-admin';
import {HttpClient, HttpHeaders} from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class PushMessegingService {
  constructor(private http: HttpClient) {
  }

  API_KEY: string = '1:705714006959:android:d9c4314823c35f63021d5a'; //shouldn't be in client, but we dont have a real backend so...


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
      /*webpush:{
        headers:{
          imag: 'https://m.media-amazon.com/images/I/71bVEGMBolS._AC_UL1500_.jpg'
        }
      }*/
    }
    this.http.post(urlString, body, options)
  }

  createDebtNotification(debtorUserName: string, value: string): admin.messaging.Notification {
    return {
      title: 'Offene Schulden',
      body: debtorUserName + 'erinnert dich daran, dass du ihm noch' + value + 'schuldest'
    }
  }

}

