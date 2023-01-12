
import {Injectable} from '@angular/core';
import * as admin from 'firebase-admin';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Environment} from "@angular/cli/lib/config/workspace-schema";
import {environment} from "../../environments/environment";
import {formatCurrency} from "./helper/currencies";



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
      to: "/topics/" + targetUserID,
      notification: this.createDebtNotification(debtorUserName, value),
      webpush: {
        headers: {
          image: 'https://m.media-amazon.com/images/I/71bVEGMBolS._AC_UL1500_.jpg'
        }
      },
      android: {
        notification: {
          imageUrl: 'https://m.media-amazon.com/images/I/71bVEGMBolS._AC_UL1500_.jpg'
        }
      },
    }
    this.http.post(urlString, body, options).subscribe((res) => console.log(res))
  }

  createDebtNotification(debtorUserName: string, value: string): admin.messaging.Notification {
    const pushMessages = require("./pushMessages.json");
    let index = Math.floor(Math.random() * (Object.keys(pushMessages.notifications[0]).length + 2))
    return {
      title: pushMessages.notifications[index].title,
      body: pushMessages.notifications[index].body.replace('[name]', debtorUserName).replace('[value]', value),
      imageUrl: 'https://m.media-amazon.com/images/I/71bVEGMBolS._AC_UL1500_.jpg'
    }
  }

}

