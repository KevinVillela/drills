import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourtComponent } from './court.component';
import { ModelModule } from '../model/model.module';
import { MatSliderModule, MatButtonModule } from '@angular/material';
import { IconService } from './icons';

@Pipe({ name: 'array' })
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
    MatButtonModule
  ],
  providers: [IconService],
  declarations: [CourtComponent, ArrayPipe],
  exports: [CourtComponent, ArrayPipe],
})
export class CourtModule { }
