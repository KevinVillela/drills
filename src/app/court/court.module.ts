import {CommonModule} from '@angular/common';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {MatButtonModule, MatSliderModule} from '@angular/material';

import {ModelModule} from '../model/model.module';

import {CourtComponent} from './court.component';
import {IconService} from './icons';

@Pipe({name: 'array'})
export class ArrayPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const res: number[] = [];
    for (let i = 1; i <= value; i++) {
      res.push(i);
    }
    return res;
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatSliderModule,
    MatButtonModule,
  ],
  declarations: [CourtComponent, ArrayPipe],
  exports: [CourtComponent, ArrayPipe],
})
export class CourtModule {
}
