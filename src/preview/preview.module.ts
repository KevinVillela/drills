import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuItem,
  MatMenuModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {StarRatingModule} from 'angular-star-rating';

import {CourtModule} from '../app/court/court.module';
import {StarModule} from '../shared/star/star.module';

import {PreviewComponent} from './preview.component';
import {ViewDrillComponent} from './view.component';

@NgModule({
  imports : [
    CommonModule, MatExpansionModule, MatIconModule, RouterModule, CourtModule, MatButtonModule,
    MatTooltipModule, StarModule, StarRatingModule.forRoot(), MatMenuModule, MatSnackBarModule
  ],
  declarations : [ PreviewComponent, ViewDrillComponent ],
  exports : [ PreviewComponent ],
})
export class PreviewModule {
}
