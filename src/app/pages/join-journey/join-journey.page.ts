import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {AuthenticationService} from '../../services/auth.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-join-journey',
  templateUrl: './join-journey.page.html',
  styleUrls: ['./join-journey.page.scss'],
})
export class JoinJourneyPage implements OnInit {

  inviteCode = '';
  userId = '';
  errorText = '';

  constructor(public router: NavController,
              private databaseService: DatabaseService,
              private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.authService.expectUserId().then((id) => this.userId = id);
  }

  joinJourney() {
    this.errorText = '';
    let journeyId = '';
    console.log(this.inviteCode);
    this.databaseService.getJourneyByInviteCode(this.inviteCode.toString())
      .then(async (journey) => {
        console.log(journey);
        await this.databaseService.addUserToJourney(journey, this.userId)
          .then(() => {
            journeyId = journey.id;
          }).catch((error) => {
            this.errorText = 'Failed: ' + error;
          });
      }).catch(() => {
      this.errorText = 'Invalid Code!';
    }).finally(() => {
      if (journeyId) {
        this.router.navigateRoot(['/journeys/']).then(() => {
          this.router.navigateForward(['/journey/' + journeyId]);
        });
      }
    });
  }
}
