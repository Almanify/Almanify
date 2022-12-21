import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Journey} from '../../data/Journey';
import {User} from '../../data/User';
import {DatabaseService} from '../../services/database.service';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;

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

  constructor(private route: ActivatedRoute,
              private databaseService: DatabaseService) {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.journey = new Journey(this.id, '', '', '', Timestamp.fromDate(new Date()), Timestamp.fromDate(new Date()), []);
      this.databaseService.journeyCrudHandler.read(this.journey).then((j: Journey) => {
        this.journey = j;
        this.inviteCode = Number(j.inviteCode);
        this.getParticipants(j);
      });
    });
  }

  ngOnInit() {
  }

  getParticipants(journey: Journey) {
    journey.journeyParticipants
      .forEach(participant => this.databaseService.userCrudHandler
        .readByID(participant)
        .then(u => this.participants.push(u)));
  }

}