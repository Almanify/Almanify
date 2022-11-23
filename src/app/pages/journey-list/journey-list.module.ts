import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JourneyListPageRoutingModule } from './journey-list-routing.module';

import { JourneyListPage } from './journey-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JourneyListPageRoutingModule
  ],
  declarations: [JourneyListPage]
})
export class JourneyListPageModule {}
