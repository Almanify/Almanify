import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isLoginMode: boolean = true;
  private router: Router;

  constructor(private r: Router) {
    this.router = r;
  }

  onLogin() {
    console.log("Login");
    // skipping login for now, just go to home
    this.router.navigate(['/home']);
  }

  ngOnInit() {
  }

}
