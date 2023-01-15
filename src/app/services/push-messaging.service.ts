import {Injectable} from '@angular/core';
import * as admin from 'firebase-admin';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ActionPerformed, PushNotifications, PushNotificationSchema} from '@capacitor/push-notifications';
import {FCM} from '@capacitor-community/fcm';
import {AuthenticationService} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class PushMessagingService {
  constructor(private http: HttpClient, public authService: AuthenticationService) {
  }


  sendNotificationToUser(targetUserID: string, debtorUserName: string, value: string) {
    const urlString = 'https://fcm.googleapis.com/fcm/send';
    const options = {
      headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: 'key=' + environment.firebaseConfig.apiKeyServer
      })
    };
    const body = {
      to: '/topics/' + targetUserID,
      notification: this.createDebtNotification(debtorUserName, value)
    };
    this.http.post(urlString, body, options).subscribe((res) => console.log(res));
  }

  createDebtNotification(debtorUserName: string, value: string): admin.messaging.Notification {
    const pushMessages = require('./pushMessages.json');
    const index = Math.floor(Math.random() * (Object.keys(pushMessages.notifications[0]).length + 2));
    return {
      title: pushMessages.notifications[index].title,
      body: pushMessages.notifications[index].body.replace('[name]', debtorUserName).replace('[value]', value),
    };
  }

  async setupPushNote() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register().then(async () => {
          FCM.subscribeTo({topic: await this.authService.expectUser()})
            .catch((err) => console.log(err));
        });
      } else {
        throw new Error('no push notifications permission');
      }
    }).catch((err) => console.log(err));

    // Show us the notification payload if the app is open on our device
    //TODO: not working
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      },
    ).catch((err) => console.log(err));
    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
        //TODO: could be used to open a new payment
      }
    ).catch((err) => console.log(err));
  }

  async unsubPushNote() {
    FCM.unsubscribeFrom({topic: await this.authService.expectUser()})
      .catch((err) => console.log(err));
  }
}

