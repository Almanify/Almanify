
import {Injectable} from '@angular/core';
import * as admin from 'firebase-admin';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Environment} from "@angular/cli/lib/config/workspace-schema";
import {environment} from "../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class PushMessagingService {
  constructor(private http: HttpClient) {
  }


  sendNotificationToUser(targetUserID: string, debtorUserName: string, value: string) {
    const urlString = 'https://fcm.googleapis.com/fcm/send';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: "key=" + environment.firebaseConfig.apiKeyServer
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
    this.http.post(urlString, body, options).subscribe((res) => console.log(res))
  }

  createDebtNotification(debtorUserName: string, value: string): admin.messaging.Notification {
    return {
      title: 'Offene Schulden',
      body: debtorUserName + 'erinnert dich daran, dass du ihm noch' + value + 'schuldest'
    }
  }

}

