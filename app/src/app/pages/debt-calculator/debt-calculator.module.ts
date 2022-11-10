import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebtCalculatorPageRoutingModule } from './debt-calculator-routing.module';

import { DebtCalculatorPage } from './debt-calculator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebtCalculatorPageRoutingModule
  ],
  declarations: [DebtCalculatorPage]
})
export class DebtCalculatorPageModule {}
