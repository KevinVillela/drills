import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { MatSelectModule, MatTooltipModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from './filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule
  ],
  declarations: [FilterComponent, SearchFilterPipe],
  exports: [FilterComponent, SearchFilterPipe],
})
export class FilterModule { }
