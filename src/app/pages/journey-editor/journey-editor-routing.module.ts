import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JourneyEditorPage } from './journey-editor.page';

const routes: Routes = [
  {
    path: '',
    component: JourneyEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyEditorPageRoutingModule {}
