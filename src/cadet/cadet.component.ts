import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

import {DrillWithId, PHASES} from '../app/model/types';
import {DatabaseService} from '../database.service';
import {DrillsFilter} from '../filter/filter.component';
import { SearchFilterPipe, searchFilter } from '../filter/filter.pipe';

@Component({
  selector : 'drills-cadet',
  templateUrl : './cadet.component.html',
  styleUrls : [ './cadet.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadetComponent implements OnInit {
  drills: DrillWithId[];
  /** The object to filter by. */
  filter: DrillsFilter = {
    environment : [],
    focus: [],
  };
  plan: DrillWithId[];
  readonly phases = PHASES;

  constructor(databaseService: DatabaseService) {
    databaseService.drills.subscribe((drills) => { this.drills = drills; });
  }

  ngOnInit() {}

  generate() {
    this.plan = [];
    for (const phase of PHASES) {
      const newDrill = this.drillForPhase(phase.value);
      if (newDrill) {
        this.plan.push(newDrill);
      }
    }
  }

  private drillForPhase(phase: number) {
    const phaseDrills = searchFilter(this.drills, this.filter).filter((drill) => drill.phase === phase);
    return phaseDrills[Math.floor(Math.random() * phaseDrills.length)];
  }

  drillForPhaseInPlan(phase: number) {
    if (!this.plan) {
      return undefined;
    }
    return this.plan.find((drill) => drill.phase === phase);
  }

  refresh(phase: number) {
    for (let i = 0; i < 5; i++) {
      // Try 5 times to get a different drill.
      const oldDrill = this.plan[phase - 1];
      const newDrill = this.drillForPhase(oldDrill.phase);
      if (oldDrill !== newDrill) {
        this.plan[phase - 1] = newDrill;
        return;
      }
    }
  }
}
