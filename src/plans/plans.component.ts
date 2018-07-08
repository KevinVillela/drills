import { Component, OnInit } from '@angular/core';
import { PlansService } from './plans.service';
import { Observable } from 'rxjs/Observable';
import { Plan, PlanWithId } from '../database.service';

@Component({
  selector: 'drills-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  plans: Observable<PlanWithId[]>;

  constructor(private readonly plansService: PlansService) {
    this.plans = this.plansService.plans;
  }

  ngOnInit() {

  }

}
