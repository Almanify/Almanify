import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JourneyDetailsPage } from './journey-details.page';

const routes: Routes = [
  {
    path: '',
    component: JourneyDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyDetailsPageRoutingModule {}
