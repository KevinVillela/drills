import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingsComponent } from './rankings.component';
import { HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import { MatSelectModule, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatSelectModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  declarations: [RankingsComponent]
})
export class RankingsModule { }
