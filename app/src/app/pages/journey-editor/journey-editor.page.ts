import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-journey-editor',
  templateUrl: './journey-editor.page.html',
  styleUrls: ['./journey-editor.page.scss'],
})
export class JourneyEditorPage implements OnInit {
  
  private isEditMode: boolean = false;

  journey: {
    name: string;
    def_currency: string;
    start: string;
    end: string;
    people: Array<string>;
    invite_code: number;
    creator: string;
    status: string;
  } = undefined;

  currencies: Array<string> = undefined;

  constructor(private route: ActivatedRoute) { 
    this.journey =
      {
        name: 'Title here',
        def_currency: '',
        start: '',
        end: '',
        people: [
          'Bob',
          'Sally',
          'John',
          'Jane'
        ],
        invite_code: 12345,
        creator: 'Bob',
        status: 'active'
      }
    ;
    this.currencies = [
      '€',
      '$',
      '¥'
    ]
  }

  ngOnInit() {
    this.isEditMode = Boolean(this.route.snapshot.paramMap.get('edit'));
    if(this.isEditMode) {
      this.journey.name = this.route.snapshot.paramMap.get('name');
      this.journey.def_currency = this.route.snapshot.paramMap.get('cur');
      this.journey.start = this.route.snapshot.paramMap.get('start');
      this.journey.invite_code = parseInt(this.route.snapshot.paramMap.get('code'));
      const str = this.route.snapshot.paramMap.get('people');
      this.journey.people = str.split(/[,]+/);
      this.journey.creator = this.route.snapshot.paramMap.get('creator');
    }
  }
}
