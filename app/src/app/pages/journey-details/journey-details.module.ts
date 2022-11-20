import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JourneyDetailsPageRoutingModule } from './journey-details-routing.module';

import { JourneyDetailsPage } from './journey-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JourneyDetailsPageRoutingModule
  ],
  declarations: [JourneyDetailsPage]
})
export class JourneyDetailsPageModule {}
