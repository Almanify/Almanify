import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isEastern:boolean = false
  @ViewChild("isEggVideo", { static: false }) videoplayer: ElementRef;
  constructor() {
  }

  ngOnInit() {
  }

  startEasterEgg(){
    this.isEastern = true;
  }
  endEasterEgg(){
    this.isEastern = false;
  }
}
