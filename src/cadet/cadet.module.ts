import {CommonModule} from '@angular/common';
import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatSnackBarModule
} from '@angular/material';

import {DrillWithId} from '../app/model/types';
import {PlanDrill} from '../database.service';
import {DatabaseModule} from '../database/database.module';
import {FilterModule} from '../filter/filter.module';
import {PreviewModule} from '../preview/preview.module';

import {CadetComponent} from './cadet.component';
import { HomeModule } from '../app/home/home.module';
import { UserPickerModule } from '../shared/user-picker/user-picker.module';

@Pipe({
  name : 'orderByPhase',
  pure : false,
})
export class SortByPhasePope implements PipeTransform {
  transform(items: DrillWithId[]|null, byPhase: boolean): DrillWithId[] {
    if (!items) {
      return [];
    }
    if (!byPhase) {
      return items;
    }
    return items.sort((a, b) => a.phase - b.phase);
  }
}

@NgModule({
  imports : [
    CommonModule,
    FilterModule,
    MatButtonModule,
    DatabaseModule,
    MatExpansionModule,
    PreviewModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    HomeModule,
    UserPickerModule,
    MatSnackBarModule
  ],
  declarations : [ CadetComponent, SortByPhasePope ]
})
export class CadetModule {
}
