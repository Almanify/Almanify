import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IonInput} from '@ionic/angular';
import {AuthentificationService} from "../../services/auth.service";
import {SignUPService} from "../../services/sign-up.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../data/User";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private isDebug: boolean = true;
  isLoginMode: boolean = true;

  validationForm: FormGroup;
  validationMessages;


  constructor(public router: Router,
              private activatedRoute: ActivatedRoute,
              public authService: AuthentificationService,
              public signUpService: SignUPService,
              public formBuilder: FormBuilder) {
    this.prepareFormValidation();
    this.router = router;
  }

  public command: string;

  ngOnInit() {
    this.command = this.activatedRoute.snapshot.paramMap.get('command');
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

  private signUp(email: IonInput, password: IonInput, username: IonInput) {
    let user = new User("",  username.value as string);
    this.signUpService.createUser(user, email.value as string, password.value as string);
    this.isLoginMode = true;
  }


  logOut() {
    this.authService.signOut()
      .then((res) => {
        this.router.navigateByUrl('/login/login');
      }).catch((error) => {
      window.alert(error.message)
    })
  }

  prepareFormValidation() {
    this.validationForm = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      Username: ['', Validators.required],
      ConfirmPassword: new FormControl('',
        Validators.required),
    }, {
      validators: this.passwordIsEqual.bind(this)
    });
    this.validationMessages = {
      'Email': [
        {type: 'required', message: 'E-Mail address required!'}
      ],
      'Password': [
        {type: 'required', message: 'Password required!'}
      ],
      'Username': [
        {type: 'required', message: 'Username required!'}
      ],
      'ConfirmPassword': [
        {type: 'required', message: 'Confirm Password required!'}
      ],
    };
  }

  passwordIsEqual(formGroup
                    :
                    FormGroup
  ) {
    const {value: password} = formGroup.get('Password');
    const {value: confirmPassword} = formGroup.get('ConfirmPassword');
    return password === confirmPassword ? null : {passwordNotMatch: true};
  }

  //just for debug and lazy test login
  private

  loginTestuser(user
                  :
                  string,
  ) {
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
