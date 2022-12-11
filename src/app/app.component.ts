import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/auth.service';
import {DatabaseService} from "./services/database.service";
import {user} from "@angular/fire/auth";

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
    this.databaseService.userCRUDHandler.readByID(this.authService.getUserId).then(user => this.userName = user.userName)
    this.authService.getObservable().subscribe(value => {
      this.databaseService.userCRUDHandler.readByID(value).then(user => this.userName = user.userName)
      if (this.authService.isAuthenticated.value) {
        this.appPages = this.unblockedPages;
      } else {
        this.appPages = this.blockedPages;
      }
    });
  }
}

