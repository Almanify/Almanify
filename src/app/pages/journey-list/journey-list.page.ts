import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DatabaseService} from '../../services/database.service';
import {Journey} from '../../data/Journey';
import {AuthenticationService} from '../../services/auth.service';

@Component({
  selector: 'app-journey-list',
  templateUrl: './journey-list.page.html',
  styleUrls: ['./journey-list.page.scss'],
})
export class JourneyListPage implements OnInit {

  userId = '';
  journeys: Journey[] = [];

  filteredJourneys: Journey[] = [];

  journeyType = 'all';
  journeyRole = 'joined';
  databaseService: DatabaseService;

  constructor(private router: Router,
              private db: DatabaseService,
              private as: AuthenticationService) {
    this.databaseService = db;
    this.userId = as.getUserId;
    console.log(this.userId);
    // this.databaseService.getJoinedJourneys(this.userId).then((journeys) => {
    this.databaseService.getJourneys().then((journeys) => {
      this.journeys = journeys;
      this.filterJourneys();
    });
  }

  segmentChanged(event) {
    if (event.detail.value === 'active') {
      this.journeyType = 'active';
    } else if (event.detail.value === 'archived') {
      this.journeyType = 'archived';
    } else if (event.detail.value === 'all') {
      this.journeyType = 'all';
    } else if (event.detail.value === 'joined') {
      this.journeyRole = 'joined';
    } else if (event.detail.value === 'created') {
      this.journeyRole = 'created';
    }
    this.filterJourneys();
  }

  filterJourneys() {
    if (this.journeyType === 'all') {
      this.filteredJourneys = this.journeys;
    } else if (this.journeyType === 'active') {
      this.filteredJourneys = this.journeys.filter(journey => journey.active);
    } else if (this.journeyType === 'archived') {
      this.filteredJourneys = this.journeys.filter(journey => !journey.active);
    }
    if (this.journeyRole === 'joined') {
      // nothing to do, all shown journeys joined
    } else if (this.journeyRole === 'created') {
      this.filteredJourneys = this.filteredJourneys.filter(journey => journey.creatorID === this.userId);
    }
  }

  sendJourneyDetails(editMode, name, cur, start, code, people, creator) {
    this.router.navigate(['/journey-editor', {
      queryParams: {
        edit: editMode,
        name,
        cur,
        start,
        code,
        people: [people],
        creator
      }
    }]);
  }

  viewJourney(journey) {
    this.router.navigate(['/journey']);
  }

  ngOnInit() {
  }

}
