import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Journey} from '../../data/Journey';
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

  constructor(private route: ActivatedRoute,
              private databaseService: DatabaseService) {
    this.route.params.subscribe(params => {
      this.id = params.id;
      const journey = new Journey(this.id, '', '', '', Timestamp.fromDate(new Date()), Timestamp.fromDate(new Date()), []);
      this.databaseService.journeyCrudHandler.read(journey).then((j: Journey) => {
        this.inviteCode = Number(j.inviteCode);
      });
    });
  }

  ngOnInit() {
  }

}
