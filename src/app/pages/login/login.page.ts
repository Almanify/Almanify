import {Component, OnInit} from '@angular/core';
import {AlertController, IonInput, LoadingController} from '@ionic/angular';
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
              public authService: AuthenticationService,
              public signUpService: SignUPService,
              public formBuilder: FormBuilder,
              public databaseService: DatabaseService,
              public loadingController: LoadingController,
              public alertController: AlertController) {
    this.prepareFormValidation();
    this.router = router;
  }

  ngOnInit() {
    this.authService.expectUser().then((userId) => this.navigateLoggedInUser(userId));
  }

  async logIn(email: IonInput, password: IonInput) {
    await this.logInWithString(email.value as string, password.value as string);
  }

  async logInWithString(email: string, password: string) {
    const loading = await this.loadingController.create({
      message: 'Logging you in...'
    });
    await loading.present();
    console.log('Remember me: ' + this.rememberMe);
    this.authService.signIn(email, password, this.rememberMe)
      .then(async (res) => {
        await this.navigateLoggedInUser(res.user.uid);
        await loading.dismiss();
      })
      .catch((error) =>
        this.alertController.create({
          header: 'Login failed',
          message: error.message,
          buttons: ['OK']
        }).then(alert => loading.dismiss().then(() => alert.present())));
  }

  async navigateLoggedInUser(userId?: string) {
    await this.databaseService.getJoinedJourneys(userId ?? await this.authService.expectUser()).then((journeys) => {

      if (!journeys || journeys.length === 0) {
        this.router.navigateRoot('/home');
        return;
      }

      const activeJourney = journeys.sort((x, y) => y.start.seconds - x.start.seconds).find(x => x.active);
      if (activeJourney) {
        this.router.navigateRoot('/journey/' + activeJourney.id);
      } else {
        this.router.navigateRoot('/journeys');
      }
    }).catch((error) =>
      this.alertController.create({
        header: 'Error while loading journeys',
        message: error.message,
        buttons: ['OK']
      }).then(alert => alert.present()));
  }

  signUp(email: IonInput, password: IonInput, username: IonInput) {
    const user = new User('', username.value as string);
    this.signUpService.createUser(user, email.value as string, password.value as string)
      .then(_ => this.isLoginMode = true)
      .catch((error) => window.alert(error.message));
  }

  rememberMeToggle($event: CustomEvent) {
    this.rememberMe = $event.detail.checked;
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
    console.log('loginTestuser');
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
