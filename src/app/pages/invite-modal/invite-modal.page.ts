import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.page.html',
  styleUrls: ['./invite-modal.page.scss'],
})
export class InviteModalPage implements OnInit {
  id: string;
  inviteCode: number;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params.id;
    });
    //TODO: Fetch journey to get invite code for display
    this.inviteCode = 1;
  }

  ngOnInit() {
  }

}
