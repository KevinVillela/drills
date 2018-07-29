import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimatorComponent } from './animator.component';
import { MatSliderModule, MatIconModule, MatButtonModule, MatSlideToggleModule, MatMenuModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { LegendModule } from '../legend/legend.module';
import { CourtModule } from '../court/court.module';
import { ActionModule } from '../action/action.module';
import { BrowserModule } from '@angular/platform-browser';
import { ModelModule } from '../model/model.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ModelModule,
    FormsModule,
    MatSliderModule,
    MatIconModule,
    HttpClientModule,
    LegendModule,
    CourtModule,
    MatButtonModule,
    MatSliderModule,
    MatSlideToggleModule,
    ActionModule,
    MatMenuModule,
  ],
  declarations: [AnimatorComponent],
  exports: [AnimatorComponent]
})
export class AnimatorModule { }
