import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatSelect,
  MatSelectModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {AngularFireModule} from 'angularfire2';

import {HomeComponent, SearchFilterPipe} from './home.component';
import { CourtModule } from '../court/court.module';

@NgModule({
  imports : [
    CommonModule,
    AngularFireModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    RouterModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatExpansionModule,
    CourtModule,
  ],
  declarations : [ HomeComponent, SearchFilterPipe ],
  exports : [ HomeComponent ],
})
export class HomeModule {
}
