import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/auth.service';
import {DatabaseService} from './services/database.service';

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
    {title: 'Options', url: '/options', icon: 'construct'},
    {title: 'Logout', url: '/login/logout', icon: 'log-out'},
  ];

  public appPages = [];

  constructor(public authService: AuthenticationService, private databaseService: DatabaseService) {
    this.appPages = this.blockedPages;
  }

  ngOnInit() {
    this.databaseService.userCrudHandler.readByID(this.authService.getUserId).then(u => {
      console.log('user', u);
      this.userName = u.userName;
      this.appPages = this.authService.isAuthenticated.getValue() ? this.unblockedPages : this.blockedPages;
    });

    this.authService.getObservable().subscribe(value => {
      console.log(value);
      this.databaseService.userCrudHandler.readByID(value).then(u => this.userName = u.userName);
      this.appPages = this.authService.isAuthenticated.getValue() ? this.unblockedPages : this.blockedPages;
    });
  }
}

