import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from 'src/app/services/database.service';
import {Journey} from "../../data/Journey";
import * as Lodash from 'lodash';
import {AuthentificationService} from "../../services/auth.service";
import {Journey_Participants} from "../../data/Journey_Participants";
import {IonDatetime, NavController} from "@ionic/angular";

@Component({
  selector: 'app-journey-editor',
  templateUrl: './journey-editor.page.html',
  styleUrls: ['./journey-editor.page.scss'],
})
export class JourneyEditorPage implements OnInit {

  private isEditMode: boolean = false;

  private journeys: Journey[];
  private journey: Journey;
  private journeyParticipants: Journey_Participants;
  currencies: Array<string> = undefined;
  people
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private databaseService: DatabaseService,
              public authService: AuthentificationService,
              public navCtrl: NavController,) {
    let id = this.activatedRoute.snapshot.paramMap.get('id')
    if (id != null) {
      this.isEditMode = true;
        this.databaseService.readJourney().then(journeys => {
        this.journeys = journeys;
        this.loadJourney(id)
        console.log("This Journey", this.journey)
      });
    } else {
      this.journey = new Journey("", "", authService.user_user_id, "1", new Date(), new Date())
    }
    this.currencies = [
      '€',
      '$',
      '¥'
    ]
    this.people = [ 'Hanz' ,'Maier', 'Wurst']
  }

  updateStartDate(value) {
    this.journey.start = new Date(value);
  }

  updateEndDate(value) {
    this.journey.end = new Date(value);
  }

  loadJourney(id: string) {
    this.journey = Lodash.find(this.journeys, ['id', id]);
    //TODO Teilnehmer aus Datenbank lesen
  }

  async save(){
    this.databaseService.persist(this.journey).then(id => {
      this.navCtrl.navigateRoot('root');
      this.router.navigateByUrl('/home');
    });
  }
  ngOnInit() {

  }
}
