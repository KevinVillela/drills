import {Component, Input, OnInit} from '@angular/core';

import {DrillWithId} from '../../app/model/types';
import {Plan, PlanWithId} from '../../database.service';
import {PlansService} from '../plans.service';

@Component({
  selector : 'drills-plan',
  templateUrl : './plan.component.html',
  styleUrls : [ './plan.component.scss' ]
})
export class PlanComponent implements OnInit {

  @Input() startExpanded = false;

  @Input() planId: string;
  plan: PlanWithId|undefined;

  constructor(private readonly plansService: PlansService) {}

  ngOnInit() {
    this.plansService.planForId(this.planId).subscribe((plan) => { this.plan = plan; });
  }

  drillsForPlan(): DrillWithId[] {
    if (!this.plan) {
      return [];
    }
    return this.plansService.drillsForPlan(this.plan);
  }
}
