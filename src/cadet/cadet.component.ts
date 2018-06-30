import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Drill, DrillWithId, DURATIONS, Environment, PHASES, ENVIRONMENTS, LEVELS, FOCUSES} from '../app/model/types';
import {DatabaseService, Plan, PlanDrill} from '../database.service';
import {DrillsFilter} from '../filter/filter.component';
import {searchFilter} from '../filter/filter.pipe';
// import { Timestamp } from '@firebase/firestore-types';
import { Timestamp } from '@firebase/firestore-types';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector : 'drills-cadet',
  templateUrl : './cadet.component.html',
  styleUrls : [ './cadet.component.css' ],
  changeDetection : ChangeDetectionStrategy.OnPush,
})
export class CadetComponent implements OnInit {
  drills: DrillWithId[];
  /** The object to filter by. */
  filter: DrillsFilter = {
    environment : [],
    focus: [],
  };

  readonly form: FormGroup;

  plan: Plan =
      {environment : Environment.BEACH, drills: [], numPlayers: 1, title: 'Untitled', location: '', datetime: undefined};
  planId?: string;
  readonly phases = PHASES;
  readonly durations = DURATIONS;
  readonly environments = ENVIRONMENTS;
  readonly levels = LEVELS;
  readonly focuses = FOCUSES;

  viewPhases = false;
  constructor(private readonly fb: FormBuilder, private readonly databaseService: DatabaseService, private readonly router: Router,
              route: ActivatedRoute, cd: ChangeDetectorRef) {
    databaseService.drills.subscribe((drills) => { this.drills = drills; });
    route.params.subscribe((params: Params) => {
      this.planId = params['id'];
      if (this.planId != null) {
        this.databaseService.loadPlan(this.planId).subscribe((plan) => {
          if (plan) {
            console.log(plan);
            this.plan = plan;
            this.filter = {
              environment : [ plan.environment ],
              focus : [],
              idealPlayers : plan.numPlayers,
            };
            this.getForm('title').setValue(plan.title);
            this.getForm('location').setValue(plan.location);
            this.getForm('notes').setValue(plan.notes);
            if (plan.datetime) {
              this.getForm('time').setValue(plan.datetime.toDate());
            }
            this.getForm('environment').setValue(plan.environment);
            this.getForm('numPlayers').setValue(plan.numPlayers);
            cd.markForCheck();
          }
        });
      }
    });
    this.form = this.fb.group({
      title : [ '', Validators.required ],
      location: [ '', Validators.required ],
      time: ['', Validators.required],
      notes: [''],
      environment: [Environment.BEACH, Validators.required],
      numPlayers: [4, Validators.required],
      // date: ['', Validators.required],
    });
  }

  ngOnInit() {}

  private getForm(name: string): AbstractControl {
    const form = this.form.get(name);
    if (!form) {
      throw new Error(`Could not find form of name ${name}`);
    }
    return form;
  }

  generate() {
    this.plan.drills = [];
    for (const phase of PHASES) {
      const newDrill = this.drillForPhase(phase.value);
      if (newDrill) {
        this.plan.drills.push({
          drillId : newDrill.id,
          duration : newDrill.duration || 10,
        });
      }
    }
  }

  drillForId(id: string) { return this.drills.find((drill) => drill.id === id); }

  drillWithId(id: string): DrillWithId|undefined {
    return this.drills.find((drill) => drill.id === id);
  }

  planDrillWithId(id: string): PlanDrill|undefined {
    return this.plan.drills.find((planDrill) => planDrill.drillId === id);
  }

  drillsForPlan() {
    const drills = this.plan.drills.map((drill) => {
      const res = this.drillForId(drill.drillId);
      if (!res) {
        throw new Error(`Couldn't find drill for ID ${drill.drillId}`);
      }
      return res;
    });
    if (this.viewPhases) {
      return drills.sort((a, b) => a.phase - b.phase);
    }
    return drills;
  }

  private drillForPhase(phase: number): DrillWithId {
    const phaseDrills =
        searchFilter(this.drills, this.filter).filter((drill) => drill.phase === phase);
    return phaseDrills[Math.floor(Math.random() * phaseDrills.length)];
  }

  save() {
    this.databaseService.upsertPlan(this.plan, this.planId).then((id) => {
      if (!this.planId) {
        this.planId = id;
        this.router.navigateByUrl(`cadet/${id}`);
      }
      alert('Plan saved successfully');
    });
  }

  addForPhase(phase: number) {
    const drill = this.randomDrill(phase);
    this.plan.drills.push(drill);
  }

  addForIndex(index: number) {
    const drill = this.randomDrill(-1);
    this.plan.drills.splice(index + 1, 0, drill);
  }

  remove(drillId: string) {
    this.plan.drills = this.plan.drills.filter((drill) => drill.drillId !== drillId);
  }

  drillsForPhaseInPlan(phase: number): Drill[] {
    if (!this.plan) {
      return [];
    }
    const drills: Drill[] = [];
    for (const planDrill of this.plan.drills) {
      const drill = this.drillForId(planDrill.drillId);
      if (drill && drill.phase === phase) {
        drills.push(drill);
      }
    }
    return drills;
  }

  private randomDrill(phase: number): PlanDrill {
    const filteredDrills = searchFilter(this.drills, this.filter).filter((drill) => {
      if (!this.viewPhases) {
        return true;
      }
      return drill.phase === phase;
    });
    const newDrill = filteredDrills[Math.floor(Math.random() * filteredDrills.length)];
    return {drillId: newDrill.id, duration: newDrill.duration};
  }

  refresh(oldDrill: DrillWithId) {
    const index = this.plan.drills.findIndex((drill) => drill.drillId === oldDrill.id);
    for (let i = 0; i < 5; i++) {
      // Try 5 times to get a different drill.
      const newDrill = this.randomDrill(oldDrill.phase);
      if (oldDrill.id !== newDrill.drillId) {
        this.plan.drills[index] = newDrill;
        return;
      }
    }
  }

  // Unused for now, keeping around if we go back to a phase-centric model.
  refreshForPhase(phase: number) {
    for (let i = 0; i < 5; i++) {
      // Try 5 times to get a different drill.
      const oldDrill = this.plan.drills[phase - 1];
      const newDrill = this.drillForPhase(phase);
      if (oldDrill.drillId !== newDrill.id) {
        this.plan.drills[phase - 1] = {drillId : newDrill.id, duration : oldDrill.duration};
        return;
      }
    }
  }
}
