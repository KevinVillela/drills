import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansComponent } from './plans.component';
import { PlanComponent, PlayerInfoPipe } from './plan/plan.component';
import { PreviewModule } from '../preview/preview.module';
import { MatExpansionModule, MatMenuModule, MatIconModule, MatButtonModule, MatChipsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ViewPlanComponent } from './plan/view-plan.component';

@NgModule({
  imports: [
    CommonModule,
    PreviewModule,
    MatExpansionModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  declarations: [PlansComponent, PlanComponent, ViewPlanComponent, PlayerInfoPipe]
})
export class PlansModule { }
