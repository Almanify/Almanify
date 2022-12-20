import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IonInput} from '@ionic/angular';
import {AuthenticationService} from '../../services/auth.service';
import {SignUPService} from '../../services/sign-up.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../data/User';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  isDebug = true;
  isLoginMode = true;
  rememberMe = false;
  command = '';

  validationForm: FormGroup;
  validationMessages;

  constructor(public router: NavController,
              private activatedRoute: ActivatedRoute,
              public authService: AuthenticationService,
              public signUpService: SignUPService,
              public formBuilder: FormBuilder) {
    this.prepareFormValidation();
    this.router = router;
  }

  ngOnInit() {
    this.command = this.activatedRoute.snapshot.paramMap.get('command');
    if (this.command === 'logout') {
      this.logOut();
    }
  }

  //copy from qapp
  logIn(email: IonInput, password: IonInput) {
    this.logInWithString(email.value as string, password.value as string);
  }

  logInWithString(email: string, password: string) {
    console.log('Remember me: ' + this.rememberMe);
    this.authService.signIn(email, password, this.rememberMe)
      .then(() => {
        this.router.navigateRoot('/home'); //TODO: anpassen wenn reise vorhanden ist
      }).catch((error) => {
      window.alert(error.message);
    });
  }

   signUp(email: IonInput, password: IonInput, username: IonInput) {
    const user = new User('',  username.value as string);
    this.signUpService.createUser(user, email.value as string, password.value as string);
    this.isLoginMode = true;
  }

  rememberMeToggle($event: CustomEvent) {
    this.rememberMe = $event.detail.checked;
  }

  logOut() {
    this.authService.signOut()
      .then(async () => {
        await this.router.navigateRoot('/login/login');
        // reload
        window.location.reload();

      }).catch((error) => {
      window.alert(error.message);
    });
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
      Email: [
        {type: 'required', message: 'E-Mail address required!'}
      ],
      Password: [
        {type: 'required', message: 'Password required!'}
      ],
      Username: [
        {type: 'required', message: 'Username required!'}
      ],
      ConfirmPassword: [
        {type: 'required', message: 'Confirm Password required!'}
      ],
    };
  }

  passwordIsEqual(formGroup: FormGroup) {
    const {value: password} = formGroup.get('Password');
    const {value: confirmPassword} = formGroup.get('ConfirmPassword');
    return password === confirmPassword ? null : {passwordNotMatch: true};
  }

  //just for debug and lazy test login
  loginTestuser(user: string,) {
    switch (user) {
      case 'hanz':
        this.logInWithString('hanz@mail.de', '123456');
        break;
      case 'peter':
        this.logInWithString('peter@mail.de', '123456');
        break;
      case 'marie':
        this.logInWithString('marie.mueller@web.de', '123456');
        break;
      case 'uwe':
        this.logInWithString('kai_uwe_der_4@mail.de', '123456');
        break;
      case 'mike':
        this.logInWithString('mike.drop@stage.en', '123456');
        break;
    }
  }
}
