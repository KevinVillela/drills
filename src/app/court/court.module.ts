import {CommonModule} from '@angular/common';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {MatButtonModule, MatSliderModule, MatIconModule} from '@angular/material';

import {ModelModule} from '../model/model.module';

import {CourtComponent} from './court.component';
import {IconService} from './icons';

@NgModule({
  imports: [
    CommonModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [CourtComponent],
  exports: [CourtComponent],
})
export class CourtModule {
}
