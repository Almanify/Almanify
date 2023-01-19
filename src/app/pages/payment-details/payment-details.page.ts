import {Component, OnInit} from '@angular/core';
import {Payment, PaymentCategory} from 'src/app/data/Payment';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../data/User';
import {Journey} from '../../data/Journey';
import {DatabaseService} from '../../services/database.service';
import {AuthenticationService} from '../../services/auth.service';
import firebase from 'firebase/compat/app';
import {ActionSheetController, AlertController, IonRouterOutlet, NavController} from '@ionic/angular';
import {convertFromCurrency, currencies, formatCurrency} from '../../services/helper/currencies';
import {PhotoService} from '../../services/photo.service';
import Timestamp = firebase.firestore.Timestamp;
import {Photo} from '@capacitor/camera';

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
  categories: PaymentCategory[];
  userIdMap: Map<string, User> = new Map();
  isEditMode = false;
  currencies = currencies;
  formatCurrency = formatCurrency;
  convertFromCurrency = convertFromCurrency;

  // only used for debt payments
  to: string;
  amount: number;
  currency: string;
  from: string;

  picEvent: any;

  constructor(public navCtrl: NavController,
              public outlet: IonRouterOutlet,
              private router: Router, private activatedRoute: ActivatedRoute,
              private databaseService: DatabaseService,
              public authService: AuthenticationService,
              private actionSheetCtrl: ActionSheetController,
              private alertController: AlertController,
              public photoService: PhotoService) {
    this.journey = new Journey();
    this.payment = new Payment();
    this.isEditMode = JSON.parse(this.activatedRoute.snapshot.paramMap.get('editmode'));
    this.journey.id = this.activatedRoute.snapshot.paramMap.get('journeyId');
    this.payment.id = this.activatedRoute.snapshot.paramMap.get('paymentId');
    this.to = this.activatedRoute.snapshot.paramMap.get('to');
    this.amount = Number(this.activatedRoute.snapshot.paramMap.get('amount') ?? undefined);
    this.currency = this.activatedRoute.snapshot.paramMap.get('currency');
    this.from = this.activatedRoute.snapshot.paramMap.get('from');
    this.databaseService.journeyCrudHandler.read(this.journey).then(
      (journey) => {
        this.journey = journey;
        if (this.payment.id) {
          //existing payment
          this.databaseService.paymentCrudHandler.read(this.payment).then((payment) => {
            this.payment = payment;
          });
        } else {
          const participants = this.to ? [this.to] : [];
          //new payment
          this.authService.expectUserId().then((uid) =>
            this.payment = new Payment(
              null,
              this.to ? 'Debt Payment' : '',
              this.from ? this.from : uid,
              this.journey.id,
              this.amount,
              this.currency || this.journey.defaultCurrency,
              Timestamp.fromDate(new Date()),
              this.to ? PaymentCategory.debtRepayment : undefined,
              participants)
          );
        }
        this.getJourneyParticipants(this.journey);
      });
    this.categories = Object.values(PaymentCategory);
  }

  getNotInvolvedUsers(): User[] {
    return this.users.filter(journeyParticipants => !this.payment.paymentParticipants.includes(journeyParticipants.id));
  }

  updatePayday(value) {
    this.payment.payday = Timestamp.fromDate(new Date(value));
  }

  ngOnInit() {
    this.authService.expectUserId().then((id) => {
      this.userId = id;
      if (!this.payment.id) { //if it's a new payment set payment creator as default payer
        this.payment.payerID = id;
        this.payment.currency = this.journey.defaultCurrency;
      }
    });
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

  async save() {
    //upload picture
    if (this.picEvent) {
      await this.photoService.uploadPicFromEvent(this.picEvent, this.userId).then(value =>
        value.toPromise().then(img =>
          this.payment.img = img
        )
      );
    }
    if (!this.payment.id) {
      //new payment
      this.databaseService.paymentCrudHandler.createAndGetID(this.payment).then(id => this.payment.id = id);
    } else {
      //save changes
      this.databaseService.paymentCrudHandler.update(this.payment).then(id => this.payment.id = id);
    }
  }

  async leave() {
    if (!this.isEditMode) {
      await this.back();
    } else {
      await this.alertUnsaved();
    }
  }

  async alertUnsaved() {
    const alert = await this.alertController.create({
      header: 'Leave without saving?',
      buttons: [
        {
          text: 'Save',
          role: 'confirm',
          handler: async () => {
            await this.save();
            await this.back();
          },
        },
        {
          text: 'exit without saving',
          role: 'cancel',
          handler: async () => {
            await this.back();
          },
        },
      ],
    });
    await alert.present();
  }

  async alertDelete(payment: Payment) {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete the picture for ' + payment.title + '?',
      buttons: [
        {
          text: 'Delete',
          role: 'confirm',
          handler: async () => {
            await this.deletePic();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  async back() {
    if (this.outlet.canGoBack()) {
      await this.navCtrl.pop();
    } else {
      await this.navCtrl.navigateRoot('/journey/' + this.journey.id);
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
    if (0 < this.payment.paymentParticipants.length) {
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


  async takePic() {
    await this.photoService.addNewToGallery().then((photo: Photo) => this.photoService.uploadPicFromPhoto(photo, this.userId));
  }

  async saveEvent(event) {
    this.picEvent = event;
  }

  async deletePic() {
    this.photoService.deletePic(this.payment.img);
    this.payment.img = null;
    this.picEvent = null;
    await this.save();
  }

}
