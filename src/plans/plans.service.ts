import { Injectable } from '@angular/core';
import { DrillWithId } from '../app/model/types';
import { Plan, DatabaseService, PlanWithId } from '../database.service';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlansService {
  drills: DrillWithId[];
  plans: Observable<PlanWithId[]>;

  constructor(private readonly databaseService: DatabaseService) {
    databaseService.drills.subscribe((drills) => { this.drills = drills; });
    this.plans = this.databaseService.plansSnapshot;
  }

  drillsForPlan(plan: Plan): DrillWithId[] {
    const drills = plan.drills.map((drill) => {
      const res = this.drillForId(drill.drillId);
      if (!res) {
        throw new Error(`Couldn't find drill for ID ${drill.drillId}`);
      }
      return res;
    });
    return drills;
  }

  drillForId(id: string) { return this.drills.find((drill) => drill.id === id); }

  planForId(id: string): Observable<PlanWithId|undefined> {
    return this.databaseService.loadPlan(id);
  }
}
