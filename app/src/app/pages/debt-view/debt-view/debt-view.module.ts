import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebtViewPageRoutingModule } from './debt-view-routing.module';

import { DebtViewPage } from './debt-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebtViewPageRoutingModule
  ],
  declarations: [DebtViewPage]
})
export class DebtViewPageModule {}
