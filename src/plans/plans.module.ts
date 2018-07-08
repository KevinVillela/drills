import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansComponent } from './plans.component';
import { PlanComponent } from './plan/plan.component';
import { PreviewModule } from '../preview/preview.module';
import { MatExpansionModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';
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
  ],
  declarations: [PlansComponent, PlanComponent, ViewPlanComponent]
})
export class PlansModule { }
