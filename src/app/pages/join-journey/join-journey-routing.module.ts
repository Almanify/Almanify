import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinJourneyPage } from './join-journey.page';

const routes: Routes = [
  {
    path: '',
    component: JoinJourneyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinJourneyPageRoutingModule {}
