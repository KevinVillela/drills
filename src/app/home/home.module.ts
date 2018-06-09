import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { AngularFireModule } from 'angularfire2';
import { MatButtonModule, MatIconModule, MatTooltipModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    RouterModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule { }
