import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatIconRegistry, MatSlideToggleModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {BrowserModule} from '@angular/platform-browser';
import {DomSanitizer} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {Router, RouterModule, Routes} from '@angular/router';

const ROUTES: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'edit', component: EditDrillComponent, pathMatch: 'full'},
  {path: 'edit/:id', component: EditDrillComponent, pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ModelModule,
    StoreModule.forRoot({drillsState: drillsReducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 100,  // Retains last 100 states
    }),
    RouterModule.forRoot(ROUTES),
    EditModule,
    HomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
        'volleyball', sanitizer.bypassSecurityTrustResourceUrl('assets/volleyball.svg'));
    iconRegistry.addSvgIcon(
        'player_white', sanitizer.bypassSecurityTrustResourceUrl('assets/player_white.svg'));
    iconRegistry.addSvgIcon(
        'player_blue', sanitizer.bypassSecurityTrustResourceUrl('assets/player_blue.svg'));
    iconRegistry.addSvgIcon(
        'player_yellow', sanitizer.bypassSecurityTrustResourceUrl('assets/player_yellow.svg'));
    iconRegistry.addSvgIcon(
        'player_green', sanitizer.bypassSecurityTrustResourceUrl('assets/player_green.svg'));
  }
}

import {ActionComponent} from './action/action.component';
import {ActionModule} from './action/action.module';
import {AppComponent} from './app.component';
import {CourtModule} from './court/court.module';
import {LegendModule} from './legend/legend.module';
import {drillsReducer} from './model/model';
import {ModelModule} from './model/model.module'; import { EditDrillComponent } from './edit/edit.component';
import { EditModule } from './edit/edit.module';
import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment.prod';
import { AngularFirestoreModule } from 'angularfire2/firestore';

