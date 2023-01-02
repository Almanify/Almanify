import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IonInput} from '@ionic/angular';
import {AuthenticationService} from '../../services/auth.service';
import {SignUPService} from '../../services/sign-up.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../data/User';
import {NavController} from '@ionic/angular';
import {DatabaseService} from '../../services/database.service';

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
              public formBuilder: FormBuilder,
              public databaseService: DatabaseService) {
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
      .then(async () => {
        await this.databaseService.getJoinedJourneys(this.authService.getUserId).then((journeys) => {

          if (!journeys || journeys.length === 0) {
            this.router.navigateRoot('/home');
            return;
          }

          const activeJourney = journeys.find((j) => j.active);
          if (activeJourney) {
            this.router.navigateRoot('/journey/' + activeJourney.id);
          } else {
            this.router.navigateRoot('/journeys');
          }
        });
      }).catch((error) => {
      window.alert(error.message);
    });
  }

  signUp(email: IonInput, password: IonInput, username: IonInput) {
    const user = new User('', username.value as string);
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
      email: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
      confirmPassword: new FormControl('',
        Validators.required),
    }, {
      validators: this.passwordIsEqual.bind(this)
    });
    this.validationMessages = {
      email: [
        {type: 'required', message: 'E-Mail address required!'}
      ],
      password: [
        {type: 'required', message: 'Password required!'}
      ],
      username: [
        {type: 'required', message: 'Username required!'}
      ],
      confirmPassword: [
        {type: 'required', message: 'Confirm Password required!'}
      ],
    };
  }

  passwordIsEqual(formGroup: FormGroup) {
    const {value: password} = formGroup.get('password');
    const {value: confirmPassword} = formGroup.get('confirmPassword');
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
