import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionComponent } from './action.component';
import { MatRadioModule, MatSliderModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    MatSliderModule
  ],
  declarations: [ActionComponent],
  exports: [ActionComponent],
})
export class ActionModule { }
