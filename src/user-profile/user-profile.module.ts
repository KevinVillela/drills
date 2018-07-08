import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { AuthModule } from '../core/auth/auth.module';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { DatabaseModule } from '../database/database.module';

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    MatButtonModule,
    MatIconModule,
    DatabaseModule
  ],
  declarations: [UserProfileComponent]
})
export class UserProfileModule { }
