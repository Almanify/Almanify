import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {JourneyEditorPageRoutingModule} from './journey-editor-routing.module';

import {JourneyEditorPage} from './journey-editor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JourneyEditorPageRoutingModule
  ],
  declarations: [JourneyEditorPage]
})
export class JourneyEditorPageModule {
}
