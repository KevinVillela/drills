import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatButtonModule, MatSlideToggleModule } from '@angular/material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LegendModule } from './legend/legend.module';
import { CourtModule } from './court/court.module';
import { ModelModule } from './model/model.module';
import { StoreModule } from '@ngrx/store';
import { drillsReducer } from './model/model';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ActionComponent } from './action/action.component';
import { ActionModule } from './action/action.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ModelModule,
    StoreModule.forRoot({ drillsState: drillsReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 100, // Retains last 100 states
    }),
    MatSliderModule,
    MatIconModule,
    HttpClientModule,
    LegendModule,
    CourtModule,
    MatButtonModule,
    MatSliderModule,
    MatSlideToggleModule,
    ActionModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'volleyball',
      sanitizer.bypassSecurityTrustResourceUrl('assets/volleyball.svg'));
    iconRegistry.addSvgIcon(
      'player_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/player_white.svg'));
    iconRegistry.addSvgIcon(
      'player_blue',
      sanitizer.bypassSecurityTrustResourceUrl('assets/player_blue.svg'));
    iconRegistry.addSvgIcon(
      'player_yellow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/player_yellow.svg'));
    iconRegistry.addSvgIcon(
      'player_green',
      sanitizer.bypassSecurityTrustResourceUrl('assets/player_green.svg'));

  }
}
