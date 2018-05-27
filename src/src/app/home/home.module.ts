import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { AngularFireModule } from 'angularfire2';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule { }
