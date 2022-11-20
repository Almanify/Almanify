import {Component} from '@angular/core';
import {AppInfo} from "@capacitor/app";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public userName: string = 'Exa_User';

  public appPages = [
    {title: 'Journeys', url: `/journeys`, icon: 'earth'},
    {title: 'Debts', url: '/debts', icon: 'cash'},
    {title: 'Options', url: '/options', icon: 'construct'},
    {title: "Logout", url: '/login', icon: "exit"}, //TODO: Real logout
    {title: 'Theme-Testing', url: '/folder/Inbox', icon: 'color-palette'},
  ];

  constructor() {
  }
}

