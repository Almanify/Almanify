import {Component, OnInit} from '@angular/core';
import {AlertController, IonInput, LoadingController} from '@ionic/angular';
import {AuthenticationService} from '../../services/auth.service';
import {SignUPService} from '../../services/sign-up.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../data/User';
import {NavController} from '@ionic/angular';
import {DatabaseService} from '../../services/database.service';
import {PushMessagingService} from '../../services/push-messaging.service';

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
              public alertController: AlertController,
              public pushMessagingService: PushMessagingService) {
    this.prepareFormValidation();
    this.router = router;
  }

  /**
   * Angular lifecycle hook that is called after the page is initialized
   */
  ngOnInit() {
    this.authService.expectUserId().then((userId) => this.navigateLoggedInUser(userId));
  }

  /**
   * Read email and password from the form and log in
   *
   * @param email the email input field
   * @param password the password input field
   */
  async logIn(email: IonInput, password: IonInput) {
    await this.logInWithString(email.value as string, password.value as string);
  }

  /**
   * Login with email and password strings
   *
   * @param email the email
   * @param password the password
   */
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
        await this.pushMessagingService.setupPushNote().catch(() => {
          // ignore
        });
      })
      .catch((error) =>
        this.alertController.create({
          header: 'Login failed',
          message: error.message,
          buttons: ['OK']
        }).then(alert => loading.dismiss().then(() => alert.present())));
  }

  /**
   * Navigate to the correct page depending on the user's journeys after login
   *
   * @param userId the user id
   */
  async navigateLoggedInUser(userId?: string) {
    await this.databaseService.getJoinedJourneys(userId ?? await this.authService.expectUserId()).then((journeys) => {

      if (!journeys || journeys.length === 0 || !journeys.find(x => x.active)) {
        this.router.navigateRoot('/home'); // /journeys would not show anything, so we go to /home
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

  /**
   * Read data from the form and sign up
   *
   * @param email the email input field
   * @param password the password input field
   * @param username the username input field
   */
  signUp(email: IonInput, password: IonInput, username: IonInput) {
    const user = new User('', username.value as string);
    this.signUpService.createUser(user, email.value as string, password.value as string)
      .then(_ => this.isLoginMode = true)
      .catch((error) =>
        this.alertController.create({
          header: 'Error while signing up',
          message: error.message,
          buttons: ['OK']
        }).then(alert => alert.present()));
  }

  /**
   * Toggle remember me to true or false
   *
   * @param $event the event
   */
  rememberMeToggle($event: CustomEvent) {
    this.rememberMe = $event.detail.checked;
  }

  /**
   * Prepare the form validation for the login and sign up form
   */
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

  /**
   * Check if the password and the confirm password are equal
   *
   * @param formGroup the form group
   */
  passwordIsEqual(formGroup: FormGroup) {
    const {value: password} = formGroup.get('password');
    const {value: confirmPassword} = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : {passwordNotMatch: true};
  }

  /**
   * Login with a test user
   *
   * @param user the username of the test user
   */
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
