import {Component, OnInit, ViewChild} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
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
  buttonDisabled: boolean=true;
  inEditMode: boolean=false;
  message = 'Informationen wurden erfolgreich bearbeitet';

  constructor(public authService: AuthenticationService, private databaseService: DatabaseService) {
    this.user = new User();
  }

  ngOnInit() {
    this.getUserInformation();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.user.userName, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  getUserInformation() {
    this.databaseService.userCrudHandler.readByID(this.authService.getUserId).then(u => {
      this.user.id = u.id;
      this.user.userName = u.userName;
      this.user.userCurrency = u.userCurrency;
    });

    this.email = this.authService.getUserEmail;
  }

  changeEditMode() {
    this.buttonDisabled = !this.buttonDisabled;
    this.inEditMode = !this.inEditMode;
  }

  save() {
    this.databaseService.userCrudHandler.update(this.user);
    this.changeEditMode();
  }
}
