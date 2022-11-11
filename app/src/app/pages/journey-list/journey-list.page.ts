import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-journey-list',
  templateUrl: './journey-list.page.html',
  styleUrls: ['./journey-list.page.scss'],
})
export class JourneyListPage implements OnInit {

  user = 'Bob';
  journeys: Array<{
    name: string;
    start: string;
    end: string;
    people: Array<string>;
    creator: string;
    status: string;
  }> = undefined;

  filteredJourneys: Array<{
    name: string;
    start: string;
    end: string;
    people: Array<string>;
    creator: string;
    status: string;
  }> = undefined;

  journeyType = 'all';
  journeyRole = 'joined';

  constructor() {
    this.journeys = [
      {
        name: 'Frankreich 2021',
        start: '2021-01-01',
        end: '2021-01-02',
        people: [
          'Bob',
          'Sally',
          'John',
          'Jane'
        ],
        creator: 'Bob',
        status: 'active'
      },
      {
        name: 'Malle 2020',
        start: '2020-04-01',
        end: '2020-04-08',
        people: [
          'Bob',
          'Sally',
        ],
        creator: 'Sally',
        status: 'archived'
      },
      {
        name: 'Quarantäne 2020',
        start: '2020-03-01',
        end: '2020-03-08',
        people: [
          'Bob',
          'Sally',
          'John',
          ],
        creator: 'John',
        status: 'archived'
      }
    ];
    this.filterJourneys();
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
      this.filteredJourneys = this.journeys.filter(journey => journey.status === 'active');
    } else if (this.journeyType === 'archived') {
      this.filteredJourneys = this.journeys.filter(journey => journey.status === 'archived');
    }
    if(this.journeyRole === 'joined') {
      this.filteredJourneys = this.filteredJourneys.filter(journey => journey.people.includes(this.user));
    } else if (this.journeyRole === 'created') {
      this.filteredJourneys = this.filteredJourneys.filter(journey => journey.creator === this.user);
    }
  }


  ngOnInit() {
  }

}
