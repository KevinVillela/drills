import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarComponent } from './star.component';
import { MatIconModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { DatabaseModule } from '../../database/database.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DatabaseModule,
    MatTooltipModule
  ],
  declarations: [StarComponent],
  exports: [StarComponent],
})
export class StarModule { }
