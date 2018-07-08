import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { MatExpansionModule, MatIconModule, MatButtonModule, MatTooltipModule, MatMenuItem, MatMenuModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { CourtModule } from '../app/court/court.module';
import { StarModule } from '../shared/star/star.module';
import { StarRatingModule } from 'angular-star-rating';
import { ViewDrillComponent } from '../preview/view.component';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule,
    CourtModule,
    MatButtonModule,
    MatTooltipModule,
    StarModule,
    StarRatingModule.forRoot(),
    MatMenuModule,
  ],
  declarations: [PreviewComponent, ViewDrillComponent],
  exports: [PreviewComponent],
})
export class PreviewModule { }
