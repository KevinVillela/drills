import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDrillComponent } from './edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatSliderModule, MatButtonModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { AnimatorModule } from '../animator/animator.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    BrowserModule,
    MatSelectModule,
    MatSliderModule,
    AnimatorModule,
    MatButtonModule
  ],
  declarations: [EditDrillComponent],
  exports: [EditDrillComponent]
})
export class EditModule { }
