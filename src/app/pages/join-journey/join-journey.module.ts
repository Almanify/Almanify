import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinJourneyPageRoutingModule } from './join-journey-routing.module';

import { JoinJourneyPage } from './join-journey.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinJourneyPageRoutingModule
  ],
  declarations: [JoinJourneyPage]
})
export class JoinJourneyPageModule {}
