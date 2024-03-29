import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Journey} from '../../data/Journey';
import {User} from '../../data/User';
import {DatabaseService} from '../../services/database.service';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {Subscription} from 'rxjs';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.page.html',
  styleUrls: ['./invite-modal.page.scss'],
})
export class InviteModalPage implements OnInit {
  id: string;
  inviteCode: number;
  journey: Journey;
  participants: Array<User> = [];
  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private databaseService: DatabaseService,
              public navCtrl: NavController) {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.journey = new Journey(this.id, '', '', '', Timestamp.fromDate(new Date()), Timestamp.fromDate(new Date()), []);

      this.subscription = this.databaseService.journeyCrudHandler.getObserver(params.id).subscribe(() => {
        this.databaseService.journeyCrudHandler.read(this.journey).then((j: Journey) => {
          this.journey = j;
          this.inviteCode = Number(j.inviteCode);
          this.getParticipants(j);
        });
      });
    });

  }

  ngOnInit() {
  }

  /**
   * Get all participants of a journey
   *
   * @param journey the journey to get the participants from
   */
  getParticipants(journey: Journey) {
    this.participants = [];
    journey.journeyParticipants
      .forEach(participant => this.databaseService.userCrudHandler
        .readByID(participant)
        .then(u => this.participants.push(u)));
  }
}
