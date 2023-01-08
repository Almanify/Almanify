import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/auth.service';
import {DatabaseService} from './services/database.service';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';
import {ImprintComponent} from './components/imprint/imprint.component';
import {GTCComponent} from './components/gtc/gtc.component';
import {PrivacyProtectionComponent} from './components/privacy-protection/privacy-protection.component';
import {PushNotifications} from "@capacitor/push-notifications";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userName = '';
  public blockedPages = [
    {title: 'Login', url: '/login/login', icon: 'log-in'}
  ];
  public unblockedPages = [
    {title: 'Home', url: `/`, icon: 'home'},
    {title: 'Journeys', url: `/journeys`, icon: 'earth'},
    {title: 'Options', url: '/options', icon: 'construct'},
    {title: 'Logout', url: '/login/logout', icon: 'log-out'},
  ];

  public appPages = [];

  router: Router;

  constructor(public authService: AuthenticationService,
              private databaseService: DatabaseService,
              router: Router, private popoverController: PopoverController) {
    this.appPages = this.blockedPages;
    this.router = router;
  }

  ngOnInit() {
    this.authService.isAuthenticated.toPromise() // this doesn't seem to work
      .then((isAuthenticated) => this.appPages = isAuthenticated ? this.unblockedPages : this.blockedPages);

    this.databaseService.userCrudHandler.readByID(this.authService.getUserId).then(u => {
      this.userName = u.userName;
    });

    this.authService.getObservable().subscribe(value => {
      this.databaseService.userCrudHandler.readByID(value).then(u => this.userName = u.userName);
      this.appPages = this.authService.isAuthenticated.getValue() ? this.unblockedPages : this.blockedPages;
    });
    this.setupPushNote();
  }


  setupPushNote() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        throw new Error('no push notifications premission')
      }
    });

  }
  async showImprint() {
    const popover = await this.popoverController.create({
      component: ImprintComponent,
      translucent: true
    });
    await popover.present();
  }

  async showPrivacy() {
    const popover = await this.popoverController.create({
      component: PrivacyProtectionComponent,
      translucent: true
    });
    await popover.present();
  }

  async showGTC() {
    const popover = await this.popoverController.create({
      component: GTCComponent,
      translucent: true
    });
    await popover.present();
  }
}

