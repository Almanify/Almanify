import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-journey-editor',
  templateUrl: './journey-editor.page.html',
  styleUrls: ['./journey-editor.page.scss'],
})
export class JourneyEditorPage implements OnInit {
  
  journeys: Array<{
    name: string;
    def_currency: string;
    start: string;
    people: Array<string>;
    invite_code: number;
    creator: string;
  }> = undefined;

  currencies: Array<string> = undefined;

  constructor() { 
    this.journeys = [
      {
        name: 'Test-Reise',
        def_currency: '€',
        start: '2022-01-01',
        people: [
          'Bob',
          'Sally',
          'John',
          'Jane'
        ],
        invite_code: 12345,
        creator: 'Bob'
      }
    ];
    this.currencies = [
      '€',
      '$',
      '¥'
    ]
  }

  ngOnInit() {
  }

}
