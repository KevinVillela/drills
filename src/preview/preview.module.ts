import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { MatExpansionModule, MatIconModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { CourtModule } from '../app/court/court.module';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule,
    CourtModule,
    MatButtonModule,
    MatTooltipModule
  ],
  declarations: [PreviewComponent],
  exports: [PreviewComponent],
})
export class PreviewModule { }
