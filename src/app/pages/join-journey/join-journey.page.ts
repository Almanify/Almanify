import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {AuthenticationService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-join-journey',
  templateUrl: './join-journey.page.html',
  styleUrls: ['./join-journey.page.scss'],
})
export class JoinJourneyPage implements OnInit {

  inviteCode = '';
  databaseService: DatabaseService;
  authService: AuthenticationService;
  userId = '';
  router: Router;
  errorText = '';

  constructor(router: Router, db: DatabaseService, as: AuthenticationService) {
    this.databaseService = db;
    this.router = router;
    this.authService = as;
  }

  ngOnInit() {
    this.userId = this.authService.getUserId;
    this.authService.getObservable().subscribe((user) => {
      this.userId = user;
    });
  }

  joinJourney() {
    this.errorText = '';
    let journeyId = '';
    console.log(this.inviteCode);
    this.databaseService.getJourneyByInviteCode(this.inviteCode)
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
        this.router.navigate(['/journeys/']).then(() => {
          this.router.navigate(['/journey/' + journeyId]);
        });
      }
    });
  }
}
