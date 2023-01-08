import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ImprintComponent} from "./components/imprint/imprint.component";
import {GTCComponent} from "./components/gtc/gtc.component";
import {PrivacyProtectionComponent} from "./components/privacy-protection/privacy-protection.component";

import {AngularFireModule} from '@angular/fire/compat/';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';


import {ReactiveFormsModule} from '@angular/forms';
import {environment} from '../environments/environment';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, ImprintComponent, GTCComponent, PrivacyProtectionComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
