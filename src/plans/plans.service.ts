import { Injectable } from '@angular/core';
import { DrillWithId } from '../app/model/types';
import { Plan, DatabaseService, PlanWithId, UserPlan } from '../database.service';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

export interface FullPlanDrill {
  drill: DrillWithId;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlansService {
  drills: DrillWithId[];
  plans: Observable<PlanWithId[]>;

  constructor(private readonly databaseService: DatabaseService,
  private readonly afs: AngularFirestore) {
    databaseService.drills.subscribe((drills) => { this.drills = drills; });
    this.plans = this.databaseService.plansSnapshot;
  }

  drillsForPlan(plan: Plan): FullPlanDrill[] {
    return plan.drills.map((drill) => {
      const res = this.drillForId(drill.drillId);
      if (!res) {
        throw new Error(`Couldn't find drill for ID ${drill.drillId}`);
      }
      return {drill: res, duration: drill.duration};
    });
  }

  drillForId(id: string) { return this.drills.find((drill) => drill.id === id); }

  planForId(id: string): Observable<PlanWithId|undefined> {
    return this.databaseService.loadPlan(id);
  }

  getUsersPlans(userId: string): Observable<UserPlan[]> {
    const plansRef = this.afs.collection<UserPlan>('planUsers', (ref) => ref.where('userId', '==', userId));
    return plansRef.valueChanges();
  }

  getPlansUsers(planId: string): Observable<UserPlan[]> {
    const users = this.afs.collection<UserPlan>('planUsers', (ref) => ref.where('planId', '==', planId));
    return users.valueChanges();
  }

  upsertPlan(plan: Plan, planId?: string): Promise<string> {
    if (planId) {
      return this.databaseService.plansCollection.doc(planId).update(plan).then(() => planId);
    } else {
      return this.databaseService.plansCollection.add(plan as PlanWithId).then((reference) => reference.id);
    }
  }
}
