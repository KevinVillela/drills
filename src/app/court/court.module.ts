import {CommonModule} from '@angular/common';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {MatButtonModule, MatSliderModule, MatIconModule, MatTooltipModule} from '@angular/material';

import {ModelModule} from '../model/model.module';

import {CourtComponent} from './court.component';
import {IconService} from './icons';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule
  ],
  declarations: [CourtComponent],
  exports: [CourtComponent],
})
export class CourtModule {
}
