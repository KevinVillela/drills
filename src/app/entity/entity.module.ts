import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityComponent } from './entity.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  declarations: [EntityComponent],
  exports: [EntityComponent],
})
export class EntityModule { }
