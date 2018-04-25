import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourtComponent } from './court.component';
import { ModelModule } from '../model/model.module';
import { EntityModule } from '../entity/entity.module';
import { MatSliderModule } from '@angular/material';

@Pipe({ name: 'array' })
export class ArrayPipe implements PipeTransform {
  transform(value, args: string[]): any {
    let res = [];
    for (let i = 1; i <= value; i++) {
      res.push(i);
    }
    return res;
  }
}

@NgModule({
  imports: [
    CommonModule,
    EntityModule,
    MatSliderModule,
  ],
  declarations: [CourtComponent, ArrayPipe],
  exports: [CourtComponent, ArrayPipe],
})
export class CourtModule { }
