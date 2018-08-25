import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AuthGuard } from './auth.guard';
import { MatSnackBarModule } from '../../../node_modules/@angular/material';

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatSnackBarModule
  ],
  providers: [AuthService, AuthGuard],
  declarations: []
})
export class AuthModule { }
