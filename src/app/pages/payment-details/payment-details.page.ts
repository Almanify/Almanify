import {Component, OnInit} from '@angular/core';
import {Payment, PaymentCategory} from 'src/app/data/Payment';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../data/User';
import {Journey} from '../../data/Journey';
import {DatabaseService} from '../../services/database.service';
import {AuthenticationService} from '../../services/auth.service';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {ActionSheetController, AlertController, IonRouterOutlet, NavController} from '@ionic/angular';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.page.html',
  styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage implements OnInit {
  userId = '';
  journey: Journey;
  payment: Payment;
  users: Array<User> = [];
  currencies: Array<string> = undefined;
  categories: PaymentCategory[];
  userIdMap: Map<string, User> = new Map();
  isEditMode = false;

  constructor(public navCtrl: NavController,
              public outlet: IonRouterOutlet,
              private router: Router, private activatedRoute: ActivatedRoute,
              private databaseService: DatabaseService,
              public authService: AuthenticationService,
              private actionSheetCtrl: ActionSheetController,
              private alertController: AlertController) {
    this.journey = new Journey();
    this.payment = new Payment();
    this.isEditMode = JSON.parse(this.activatedRoute.snapshot.paramMap.get('editmode')); //TODO prüfen ob user das darf
    this.journey.id = this.activatedRoute.snapshot.paramMap.get('journeyId');
    this.payment.id = this.activatedRoute.snapshot.paramMap.get('paymentId');
    this.databaseService.journeyCrudHandler.read(this.journey).then(
      (journey) => {
        this.journey = journey;
        if (this.payment.id !== null) {
          //existing payment
          this.databaseService.paymentCrudHandler.read(this.payment).then((payment) => {
            this.payment = payment;
          });
          this.getJourneyParticipants(journey);
        } else {
          //new payment
          this.payment = new Payment(
            null,
            '',
            this.authService.getUserId,
            this.journey.id,
            undefined,
            this.journey.defaultCurrency,
            Timestamp.fromDate(new Date()));
        }
        this.getJourneyParticipants(this.journey);
      });

    this.currencies = [
      '€',
      '$',
      '🍑'
    ];
    this.categories = Object.values(PaymentCategory);
  }

  getNotInvolvedUsers(): User[] {
    return this.users.filter(journeyParticipants => !this.payment.paymentParticipants.includes(journeyParticipants.id));
  }

  updatePayday(value) {
    this.payment.payday = Timestamp.fromDate(new Date(value));
  }

  ngOnInit() {
    this.userId = this.authService.getUserId;
    this.authService.getObservable().subscribe((u) => { // subscribe to changes
      this.userId = u;
    });
    if (this.payment.id === null) {
      //if it's a new payment set payment creator as default payer
      this.payment.payerID = this.authService.getUserId;
      this.authService.getObservable().subscribe((u) => { // subscribe to changes
        this.payment.payerID = u;
      });
    }
  }

  getJourneyParticipants(journey: Journey) {
    journey.journeyParticipants
      .forEach(participant => this.databaseService.userCrudHandler
        .readByID(participant)
        .then((u) => {
          this.users.push(u);
          this.userIdMap.set(u.id, u);
        }));
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  save() {
    if (this.payment.id === null) {
      //new payment
      this.databaseService.paymentCrudHandler.createAndGetID(this.payment).then(id => this.payment.id = id);
    } else {
      //save changes
      this.databaseService.paymentCrudHandler.update(this.payment).then(id => this.payment.id = id);
    }
  }

  leave(){
    if(!this.isEditMode){
      this.back();
      return;
    }
    this.alertUnsaved();
  }
  async alertUnsaved() {

    const alert = await this.alertController.create({
      header: 'Leave without saving?',
      buttons: [
        {
          text: 'Save',
          role: 'confirm',
          handler: () => {
            this.save();
          },
        },
        {
          text: 'exit without saving',
          role: 'cancel',
          handler: () => {
            this.back();
          },
        },
      ],
    });
    await alert.present();
  }

  back() {
    if (this.outlet.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.navigateRoot('/journey/' + this.journey.id);
    }
  };


  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Add user to the payment',
      subHeader: 'Click on a user who has caused expenses.',
      buttons: this.createButtons()
    });
    await actionSheet.present();
  }

  createButtons() {
    const buttons = [];
    const users = this.getNotInvolvedUsers();
    if (1 < users.length) {
      const allButton = {
        text: 'Add All',
        icon: 'People',
        role: 'selected',
        handler: () => users.forEach(user => this.payment.paymentParticipants.push(user.id))
      };
      buttons.push(allButton);
    }
    if (1 < this.payment.paymentParticipants.length) {
      const removeAllButton = {
        text: 'Remove All',
        icon: 'person-remove',
        handler: () => this.payment.paymentParticipants = []
      };
      buttons.push(removeAllButton);
    }
    for (const user of users) {
      const button = {
        text: user.userName,
        icon: 'Person',
        role: 'selected',
        handler: () => {
          this.payment.paymentParticipants.push(user.id);
        }
      };
      buttons.push(button);
    }
    return buttons;
  }

  removeInvolved(userID: string) {
    const index = this.payment.paymentParticipants.indexOf(userID);
    this.payment.paymentParticipants.splice(index, 1);
  }


  takePic() {
    //TODO
  }
}
