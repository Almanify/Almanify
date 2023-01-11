import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {InviteModalPage} from './invite-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InviteModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteModalPageRoutingModule {
}
