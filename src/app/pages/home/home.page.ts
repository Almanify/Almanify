import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('isEggVideo', {static: false}) videoplayer: ElementRef;
  isEastern = false;

  constructor() {
  }

  ngOnInit() {
  }

  startEasterEgg() {
    this.isEastern = true;
  }

  endEasterEgg() {
    this.isEastern = false;
  }
}
