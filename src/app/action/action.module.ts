import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionComponent } from './action.component';
import { MatRadioModule, MatSliderModule, MatIconModule, MatButtonModule, MatSlideToggleModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  declarations: [ActionComponent],
  exports: [ActionComponent],
})
export class ActionModule { }
