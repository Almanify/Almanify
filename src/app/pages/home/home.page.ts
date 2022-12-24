import { Component, OnInit } from '@angular/core';
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isEaster: boolean = false;
  constructor() { }
  ngOnInit() {
  }

  showEasterEgg() {
    this.isEaster = true;
  }
}
