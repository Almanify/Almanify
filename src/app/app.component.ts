import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/auth.service';
import {DatabaseService} from './services/database.service';
import {ActivatedRoute} from '@angular/router';
import {AlertController, LoadingController, NavController, PopoverController} from '@ionic/angular';
import {ImprintComponent} from './components/imprint/imprint.component';
import {GTCComponent} from './components/gtc/gtc.component';
import {PrivacyProtectionComponent} from './components/privacy-protection/privacy-protection.component';

type Page = {
  url?: string;
  title: string;
  icon: string;
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  userName = '';
  public blockedPages: Array<Page> = [
    {title: 'Login', url: '/login/login', icon: 'log-in'}
  ];
  public unblockedPages: Array<Page> = [
    {title: 'Home', url: `/home`, icon: 'home'},
    {title: 'Journeys', url: `/journeys`, icon: 'earth'},
    {title: 'Options', url: '/options', icon: 'construct'},
    {title: 'Logout', icon: 'log-out'}
  ];

  show = true;

  constructor(public authService: AuthenticationService,
              private databaseService: DatabaseService,
              private popoverController: PopoverController,
              private route: ActivatedRoute,
              private loadingController: LoadingController,
              private router: NavController,
              private alertController: AlertController) {
    this.route = route;
  }

  ngOnInit() {
    this.authService.getObservable().subscribe(value => {
      if (value) {
        this.databaseService.userCrudHandler.readByID(value).then(u => this.userName = u.userName);
      } else {
        this.userName = '';
      }
    });
    this.isOnLogin().then((isOnLogin) => {
      this.show = !isOnLogin;
    });

    /* console.log('app component init');
    this.authService.isAuthenticated.toPromise() // this doesn't seem to work
      .then((isAuthenticated) => this.appPages = isAuthenticated ? this.unblockedPages : this.blockedPages);

    console.log(this.authService.isAuthenticated.value); // this works

    this.databaseService.userCrudHandler.readByID(this.authService.getUserId).then(u => {
      this.userName = u.userName;
    });*/
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

  async isOnLogin(): Promise<boolean> {
    return await this.route.url.toPromise().then((url) => url[0].path.includes('login'));
  }

  public async logOut() {
    const loading = await this.loadingController.create({
      message: 'Logging you out...'
    });
    await loading.present();
    this.authService.signOut()
      .then(async () => {
        await this.router.navigateRoot('/login/login');
        await loading.dismiss();
        // window.location.reload();
      })
      .catch((error) =>
        this.alertController.create({
          header: 'Logout failed',
          message: error.message,
          buttons: ['OK']
        }).then(alert => loading.dismiss().then(() => alert.present())));
  }
}

