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

import {HomeComponent} from './home.component';
import { CourtModule } from '../court/court.module';
import { FilterModule } from '../../filter/filter.module';
import { PreviewModule } from '../../preview/preview.module';

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
    FilterModule,
    PreviewModule
  ],
  declarations : [ HomeComponent ],
  exports : [ HomeComponent ],
})
export class HomeModule {
}
