import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/auth.service';
import {DatabaseService} from './services/database.service';
import {Router} from '@angular/router';

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
    {title: 'Home', url: `/home`, icon: 'home'},
    {title: 'Journeys', url: `/journeys`, icon: 'earth'},
    {title: 'Options', url: '/options', icon: 'construct'},
    {title: 'Logout', url: '/login/logout', icon: 'log-out'},
  ];

  public appPages = [];

  router: Router;

  constructor(public authService: AuthenticationService, private databaseService: DatabaseService, router: Router) {
    this.appPages = this.blockedPages;
    this.router = router;
  }

  ngOnInit() {
    this.databaseService.userCrudHandler.readByID(this.authService.getUserId).then(u => {
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

