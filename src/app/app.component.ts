import {Component, OnInit} from '@angular/core';
import {AuthentificationService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userName = '';

  public blockedPages = [
    {title: 'Login', url: '/login', icon: 'log-in'}
  ];
  public unblockedPages = [
    {title: 'Home', url: `/home`, icon: 'home'},
    {title: 'Journeys', url: `/journeys`, icon: 'earth'},
    // {title: 'Debts', url: '/debts', icon: 'cash'},
    {title: 'Options', url: '/options', icon: 'construct'},
    {title: 'Logout', url: '/login/logout', icon: 'log-out'},
    // {title: 'Theme-Testing', url: '/testing', icon: 'color-palette'},
  ];

  public appPages = [];

  constructor(public authService: AuthentificationService) {
    this.appPages = this.blockedPages;
  }

  ngOnInit() {
    const userObservable = this.authService.getObservable();
    userObservable.subscribe(value => {
      this.userName = value;
      if (this.authService.isAuthenticated.value) {
        this.appPages = this.unblockedPages;
      } else {
        this.appPages = this.blockedPages;
      }
    });
  }
}

