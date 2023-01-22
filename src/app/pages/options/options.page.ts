import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal} from '@ionic/angular';
import {User} from '../../data/User';
import {DatabaseService} from '../../services/database.service';
import {AuthenticationService} from '../../services/auth.service';
import {currencies} from '../../services/helper/currencies';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  user: User;

  name: any;
  password: any;
  email: any;
  currency: any;

  currencies = currencies;
  buttonDisabled = true;
  inEditMode = false;
  message = 'Informationen wurden erfolgreich bearbeitet';
  isLoaded = false;

  constructor(public authService: AuthenticationService, private databaseService: DatabaseService) {
    this.user = new User();
  }

  /**
   * Angular lifecycle hook that is called after the page is initialized
   */
  ngOnInit() {
    this.getUserInformation();
  }

  /**
   * Closes the modal
   */
  confirm() {
    return this.modal.dismiss(this.user.userName, 'confirm');
  }

  /**
   * Get the user information from the database
   */
  async getUserInformation() {
    this.authService.expectUserId().then(async (uid) => {
      await this.databaseService.userCrudHandler.readByID(uid).then(u => {
        this.user.id = u.id;
        this.name = this.user.userName = u.userName;
        this.currency = this.user.userCurrency = u.userCurrency;
        this.isLoaded = true;
        this.email = this.authService.getUserEmail;
      });
    });
  }

  /**
   * Change the edit mode
   */
  changeEditMode() {
    this.buttonDisabled = !this.buttonDisabled;
    this.inEditMode = !this.inEditMode;

    // reset values
    this.name = this.user.userName;
    this.currency = this.user.userCurrency;
  }

  /**
   * Save the user information
   */
  save() {
    this.user.userName = this.name;
    this.user.userCurrency = this.currency;
    this.databaseService.userCrudHandler.update(this.user);
    this.getUserInformation().then(() => this.changeEditMode());
  }
}
