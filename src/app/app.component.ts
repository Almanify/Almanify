import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/auth.service';
import {DatabaseService} from './services/database.service';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';
import {ImprintComponent} from './components/imprint/imprint.component';
import {GTCComponent} from './components/gtc/gtc.component';
import {PrivacyProtectionComponent} from './components/privacy-protection/privacy-protection.component';

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
    console.log('app component init');
    this.authService.isAuthenticated.toPromise() // this doesn't seem to work
      .then((isAuthenticated) => this.appPages = isAuthenticated ? this.unblockedPages : this.blockedPages);

    console.log(this.authService.isAuthenticated.value); // this works

    this.databaseService.userCrudHandler.readByID(this.authService.getUserId).then(u => {
      this.userName = u.userName;
    });

    this.authService.getObservable().subscribe(value => {
      console.log(value);
      this.databaseService.userCrudHandler.readByID(value).then(u => this.userName = u.userName);
      this.appPages = this.authService.isAuthenticated.getValue() ? this.unblockedPages : this.blockedPages;
    });
  }

  async showImprint() {
    console.log('jeeet');
    const popover = await this.popoverController.create({
      component: ImprintComponent,
      translucent: true
    });
    await popover.present();
  }

  async showPrivacy() {
    console.log('jeeet');
    const popover = await this.popoverController.create({
      component: PrivacyProtectionComponent,
      translucent: true
    });
    await popover.present();
  }

  async showGTC() {
    console.log('jeeet');
    const popover = await this.popoverController.create({
      component: GTCComponent,
      translucent: true
    });
    await popover.present();
  }
}

