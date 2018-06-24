import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTooltipModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {AnimatorModule} from '../animator/animator.module';

import {EditDrillComponent} from './edit.component';

@NgModule({
  imports : [
    CommonModule, ReactiveFormsModule, MatInputModule, BrowserModule, MatSelectModule,
    MatSliderModule, AnimatorModule, MatButtonModule, MatIconModule, RouterModule,
    MatSlideToggleModule, MatTooltipModule
  ],
  declarations : [ EditDrillComponent ],
  exports : [ EditDrillComponent ]
})
export class EditModule {
}
