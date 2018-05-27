import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { drillsReducer } from './model';
import { AnimationService } from './animation';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [AnimationService],
  declarations: []
})
export class ModelModule { }
