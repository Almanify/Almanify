import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteModalPageRoutingModule } from './invite-modal-routing.module';

import { InviteModalPage } from './invite-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteModalPageRoutingModule
  ],
  declarations: [InviteModalPage]
})
export class InviteModalModule {}
