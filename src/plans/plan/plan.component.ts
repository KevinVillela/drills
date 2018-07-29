import {Component, Input, OnInit, ChangeDetectionStrategy, Pipe, PipeTransform} from '@angular/core';

import {DrillWithId} from '../../app/model/types';
import {Plan, PlanWithId, UserPlan} from '../../database.service';
import {PlansService, FullPlanDrill} from '../plans.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector : 'drills-plan',
  templateUrl : './plan.component.html',
  styleUrls : [ './plan.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanComponent implements OnInit {

  @Input() startExpanded = false;

  @Input() planId: string;
  plan: Observable<PlanWithId|undefined>;
  planDrills: Observable<FullPlanDrill[]>;

  constructor(private readonly plansService: PlansService) {}

  ngOnInit() {
    this.plan = this.plansService.planForId(this.planId);
    this.planDrills = this.plan.pipe(map((plan) => {
      return this.drillsForPlan(plan);
    }));
    /* .subscribe((plan) => { this.plan = plan; }); */
  }

  private drillsForPlan(plan): FullPlanDrill[] {
    if (!plan) {
      return [];
    }
    return this.plansService.drillsForPlan(plan);
  }
}

@Pipe({
  name: 'playerInfo',
  pure: true,
})
export class PlayerInfoPipe implements PipeTransform {
  transform(items: { [ userPlanId: string]: UserPlan}[]): UserPlan[] {
    if (!items) {
      return [];
    }
    return Object.values(items).map((item) => item);
  }
}
