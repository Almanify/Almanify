import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IonInput} from '@ionic/angular';
import {AuthentificationService} from "../../services/auth-service.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private isDebug: boolean = true;
  isLoginMode: boolean = true;

  constructor(public router: Router,
              private activatedRoute: ActivatedRoute,
              public authService: AuthentificationService) {
    this.router = router;
  }

  public command: string;

  ngOnInit() {
    this.command = this.activatedRoute.snapshot.paramMap.get('command');
    console.log(this.command);
    if (this.command == "logout") {
      this.logOut();
    }
  }

  //copy from qapp
  private logIn(email: IonInput, password: IonInput) {
    this.logInWithString(email.value as string, password.value as string)
  }

  //wtf typscript don't like overloads ???
  private logInWithString(email: string, password: string) {
    this.authService.signIn(email, password)
      .then((res) => {
        this.router.navigate(['/home']); //TODO: anpassen wenn reise vorhanden ist
      }).catch((error) => {
      window.alert(error.message)
    })
  }

  logOut() {
    this.authService.signOut()
      .then((res) => {
        this.router.navigateByUrl('/login/login');
      }).catch((error) => {
      window.alert(error.message)
    })
  }


  //just for debug and lazy test login
  private loginTestuser(user: string,) {
    switch (user) {
      case "hanz":
        this.logInWithString("hanz@mail.de", "123456");
        break;
      case "peter":
        this.logInWithString("peter@mail.de", "123456");
        break;
      case "marie":
        this.logInWithString("marie.mueller@web.de", "123456");
        break;
      case "uwe":
        this.logInWithString("kai_uwe_der_4@mail.de", "123456");
        break;
      case "mike":
        this.logInWithString("mike.drop@stage.en", "123456");
        break;
    }
  }
}
