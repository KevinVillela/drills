import { Component, OnInit } from '@angular/core';
import { PlanWithId } from '../../database.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PlansService } from '../plans.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'drills-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.css']
})
export class ViewPlanComponent implements OnInit {

  planId: Observable<string|undefined>;

  constructor(private readonly plansService: PlansService, route: ActivatedRoute
  ) {
    this.planId = route.params.pipe(
      map((params: Params) => {
      return params['id'];
    }));
  }

  ngOnInit() {
  }

}
