import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JourneyEvaluatePageRoutingModule } from './journey-evaluate-routing.module';

import { JourneyEvaluatePage } from './journey-evaluate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JourneyEvaluatePageRoutingModule
  ],
  declarations: [JourneyEvaluatePage]
})
export class JourneyEvaluatePageModule {}
