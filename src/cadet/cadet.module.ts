import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadetComponent } from './cadet.component';
import { FilterModule } from '../filter/filter.module';
import { MatButtonModule, MatExpansionModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { DatabaseModule } from '../database/database.module';
import { PreviewModule } from '../preview/preview.module';

@NgModule({
  imports: [
    CommonModule,
    FilterModule,
    MatButtonModule,
    DatabaseModule,
    MatExpansionModule,
    PreviewModule,
    MatIconModule,
    MatTooltipModule
  ],
  declarations: [CadetComponent]
})
export class CadetModule { }
