import { Injectable } from '@angular/core';
import { PHASES, DrillWithId, LEVELS } from '../app/model/types';
import { PlanDrill, DatabaseService } from '../database.service';
import { AuthService } from '../core/auth/auth.service';
import { searchFilter } from '../filter/filter.pipe';
import { DrillsFilter } from '../filter/filter.component';
import { MatSnackBar } from '../../node_modules/@angular/material';

const PLAN_CONFIGS = [{
  level: 1,
  duration: 90,
  drillPhases: [1, 1, 2, 2, 3, 4],
}, {
  level: 1,
  duration: 120,
  drillPhases: [1, 2, 2, 3, 3, 4, 5],
}, {
  level: 1,
  duration: 150,
  drillPhases: [1, 1, 2, 2, 3, 3, 3, 4, 5],
}, {
  level: 1,
  duration: 180,
  drillPhases: [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5],
}, {
  level: 2,
  duration: 90,
  drillPhases: [1, 1, 2, 2, 3, 4],
}, {
  level: 2,
  duration: 120,
  drillPhases: [1, 2, 2, 3, 3, 4, 5],
}, {
  level: 2,
  duration: 150,
  drillPhases: [1, 1, 2, 2, 3, 3, 3, 4, 5],
}, {
  level: 2,
  duration: 180,
  drillPhases: [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5],
}, {
  level: 3,
  duration: 90,
  drillPhases: [1, 2, 3, 4, 5],
}, {
  level: 3,
  duration: 120,
  drillPhases: [1, 2, 3, 3, 4, 4, 5],
}, {
  level: 3,
  duration: 150,
  drillPhases: [1, 2, 3, 3, 4, 4, 5, 5],
}, {
  level: 3,
  duration: 180,
  drillPhases: [1, 2, 2, 3, 3, 3, 4, 4, 5, 5],
}, {
  level: 4,
  duration: 90,
  drillPhases: [1, 2, 3, 4, 5],
}, {
  level: 4,
  duration: 120,
  drillPhases: [1, 2, 3, 3, 4, 4, 5],
}, {
  level: 4,
  duration: 150,
  drillPhases: [1, 2, 3, 3, 4, 4, 5, 5],
}, {
  level: 4,
  duration: 180,
  drillPhases: [1, 2, 2, 3, 3, 3, 4, 4, 5, 5],
}, {
  level: 5,
  duration: 90,
  drillPhases: [2, 3, 3, 4, 5],
}, {
  level: 5,
  duration: 120,
  drillPhases: [2, 3, 3, 4, 4, 5],
}, {
  level: 5,
  duration: 150,
  drillPhases: [1, 2, 3, 3, 4, 4, 5, 5],
}, {
  level: 5,
  duration: 180,
  drillPhases: [1, 2, 3, 3, 4, 4, 4, 5, 5],
}];

@Injectable({
  providedIn: 'root'
})
export class CadetService {
  drills: DrillWithId[];

  constructor(private readonly authService: AuthService, databaseService: DatabaseService, private readonly snackBar: MatSnackBar) {
    databaseService.drills.subscribe((drills) => { this.drills = drills; });
  }

  private drillForPhase(phase: number, filter: DrillsFilter): DrillWithId {
    const phaseDrills = searchFilter(this.authService, this.drills, filter)
                            .filter((drill) => drill.phase === phase);
    return phaseDrills[Math.floor(Math.random() * phaseDrills.length)];
  }

  generatePlan(duration: number, filter: DrillsFilter): PlanDrill[] {
    if (filter.minLevel == null) {
      this.snackBar.open(`Please define a skill level to generate the plan for.`, '', {duration: 1000});
      return [];
    }
    const planConfig = PLAN_CONFIGS.find((config) => config.duration === duration && config.level === filter.minLevel);
    if (!planConfig) {
      this.snackBar.open(`Could not find config for duration ${duration} and skill ${filter.minLevel}.`, '', {duration: 4000});
      return [];
    }
    const drills: PlanDrill[] = [];
    for (const phase of planConfig.drillPhases) {
      const newDrill = this.drillForPhase(phase, filter);
      if (newDrill) {
        drills.push({
          drillId : newDrill.id,
          duration : newDrill.duration || 10,
        });
      }
    }
    return drills;
  }
}
