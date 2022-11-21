import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebtViewPage } from './debt-view.page';

const routes: Routes = [
  {
    path: '',
    component: DebtViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebtViewPageRoutingModule {}
