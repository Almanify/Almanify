import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public userName = 'Exa_User';

  public appPages = [
    {title: 'Home', url: `/home`, icon: 'home'},
    {title: 'Journeys', url: `/journeys`, icon: 'earth'},
    // {title: 'Debts', url: '/debts', icon: 'cash'},
    {title: 'Options', url: '/options', icon: 'construct'},
    {title: 'Logout', url: '/login', icon: 'exit'}, //TODO: Real logout
    // {title: 'Theme-Testing', url: '/testing', icon: 'color-palette'},
  ];

  constructor() {
  }
}

