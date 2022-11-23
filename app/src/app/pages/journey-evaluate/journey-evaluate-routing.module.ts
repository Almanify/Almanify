import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JourneyEvaluatePage } from './journey-evaluate.page';

const routes: Routes = [
  {
    path: '',
    component: JourneyEvaluatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyEvaluatePageRoutingModule {}
