import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Params, Router} from '@angular/router';
// import { Timestamp } from '@firebase/firestore-types';
import {Timestamp} from '@firebase/firestore-types';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {distinctUntilChanged, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';

import {HomeComponent} from '../app/home/home.component';
import {SelectDrillComponent} from '../app/home/select-drill/select-drill.component';
import {
  Drill,
  DrillWithId,
  DURATIONS,
  Environment,
  ENVIRONMENTS,
  FOCUSES,
  LEVELS,
  PHASES
} from '../app/model/types';
import {AuthService} from '../core/auth/auth.service';
import {DatabaseService, Plan, PlanDrill, User, UserPlan} from '../database.service';
import {DrillsFilter} from '../filter/filter.component';
import {searchFilter} from '../filter/filter.pipe';
import {PlansService, FullPlanDrill} from '../plans/plans.service';
import { CadetService } from './cadet.service';
import { CdkDragDrop } from '@angular/cdk-experimental/drag-drop';

@Component({
  selector : 'drills-cadet',
  templateUrl : './cadet.component.html',
  styleUrls : [ './cadet.component.scss' ],
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

  generateDuration = 90;
  plan: Plan = {
    environment : Environment.BEACH,
    drills: [],
    numPlayers: 1,
    title: 'Untitled',
    location: '',
    datetime: undefined
  };

  planId?: string;
  readonly phases = PHASES;
  readonly durations = DURATIONS;
  readonly environments = ENVIRONMENTS;
  readonly levels = LEVELS;
  readonly focuses = FOCUSES;

  viewPhases = false;
  selectDialog?: MatDialogRef<SelectDrillComponent>;
  plansUsers: { [userPlanId: string]: UserPlan} = {};

  constructor(private readonly fb: FormBuilder, private readonly databaseService: DatabaseService,
              private readonly router: Router, private readonly route: ActivatedRoute,
              private readonly cd: ChangeDetectorRef, private readonly authService: AuthService,
              private readonly plansService: PlansService, private readonly dialog: MatDialog,
            private readonly cadetService: CadetService,
          private readonly snackBar: MatSnackBar) {
    this.form = this.fb.group({
      title : [ '', Validators.required ],
      location : [ '', Validators.required ],
      time : [ '', Validators.required ],
      notes : [ '' ],
      environment : [ Environment.BEACH, Validators.required ],
      numPlayers : [ 4, Validators.required ],
      date : [ '', Validators.required ],
    });
    databaseService.drills.subscribe((drills) => { this.drills = drills; });
  }

  ngOnInit() {
    const planIdObs =
        this.route.params.pipe(map((params: Params) => params['id']), distinctUntilChanged());
    planIdObs.subscribe((planId) => {
      this.planId = planId;
      if (this.planId != null) {
        this.databaseService.loadPlan(this.planId).subscribe((plan) => {
          if (plan) {
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
              const date = plan.datetime.toDate();
              this.getForm('date').setValue(date);
              this.getForm('time').setValue(`${date.toLocaleTimeString('en-GB')}`);
            }
            this.getForm('environment').setValue(plan.environment);
            this.getForm('numPlayers').setValue(plan.numPlayers);
            this.plansUsers = plan.players || {};
            this.cd.markForCheck();
          }
        });
      }
    });
  }

  onReorder(event: CdkDragDrop<{}>) {
    const tmp = this.plan.drills[event.previousIndex];
    this.plan.drills[event.previousIndex] = this.plan.drills[event.currentIndex];
    this.plan.drills[event.currentIndex] = tmp;
  }

  private getForm(name: string): AbstractControl {
    const form = this.form.get(name);
    if (!form) {
      throw new Error(`Could not find form of name ${name}`);
    }
    return form;
  }

  generate() {
    this.filter.environment = [this.getForm('environment').value];
    this.plan.drills = this.cadetService.generatePlan(this.generateDuration, this.filter);
  }

  drillWithId(id: string): DrillWithId|undefined {
    return this.drills.find((drill) => drill.id === id);
  }

  planDrillWithId(id: string): PlanDrill|undefined {
    return this.plan.drills.find((planDrill) => planDrill.drillId === id);
  }

  private justDrillsForPlan(): FullPlanDrill[] {
    const drills = this.plansService.drillsForPlan(this.plan);
    if (this.viewPhases) {
      return drills.sort((a, b) => a.drill.phase - b.drill.phase);
    }
    return drills;
  }

  drillsForPlan(): DrillWithId[] {
    const drills = this.justDrillsForPlan();
    return drills.map((drill) => drill.drill);
  }

  getTotalDuration(): number {
    return this.justDrillsForPlan().reduce((acc, planDrill) => acc + planDrill.duration, 0);
  }

  private drillForPhase(phase: number): DrillWithId {
    const phaseDrills = searchFilter(this.authService, this.drills, this.filter)
                            .filter((drill) => drill.phase === phase);
    return phaseDrills[Math.floor(Math.random() * phaseDrills.length)];
  }

  save() {
    this.plan.title = this.getForm('title').value;
    this.plan.location = this.getForm('location').value;
    this.plan.notes = this.getForm('notes').value;
    this.plan.environment = this.getForm('environment').value;
    this.plan.numPlayers = this.getForm('numPlayers').value;
    const date = this.getForm('date').value;
    const time = this.getForm('time').value;
    date.setHours(time.split(':')[0], time.split(':')[1]);
    this.plan.datetime = date;
    this.plan.players = this.plansUsers;
    this.plansService.upsertPlan(this.plan, this.planId).then((id) => {
      if (!this.planId) {
        this.planId = id;
        this.router.navigateByUrl(`cadet/${id}`);
      }
      this.snackBar.open('Plan saved successfully', '', {duration: 1000});
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

  private getDrills(): Observable<PlanDrill[]> {
    this.selectDialog = this.dialog.open(SelectDrillComponent);
    return this.selectDialog.afterClosed().pipe(map((selected: Map<string, boolean>) => {
      const ret: PlanDrill[] = [];
      if (!selected) {
        return ret;
      }
      selected.forEach((isSelected, drillId) => {
        if (isSelected) {
          ret.push({
            drillId,
            duration : 10,
          });
        }
      });
      return ret;
    }));
  }

  editForIndex(index: number) {
    this.getDrills().subscribe((selected) => {
      selected.forEach((planDrill) => { this.plan.drills.splice(index, 1, planDrill); });
      this.cd.markForCheck();
    });
  }

  addWithSelection() {
    this.getDrills().subscribe((selected) => {
      selected.forEach((planDrill) => { this.plan.drills.push(planDrill); });
      this.cd.markForCheck();
    });
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
      const drill = this.plansService.drillForId(planDrill.drillId);
      if (drill && drill.phase === phase) {
        drills.push(drill);
      }
    }
    return drills;
  }

  private randomDrill(phase: number): PlanDrill {
    const filteredDrills =
        searchFilter(this.authService, this.drills, this.filter).filter((drill) => {
          if (!this.viewPhases) {
            return true;
          }
          return drill.phase === phase;
        });
    const newDrill = filteredDrills[Math.floor(Math.random() * filteredDrills.length)];
    return {drillId : newDrill.id, duration : newDrill.duration};
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

  trackByPlanDrill(index: number, planDrill: FullPlanDrill) {
    return `${planDrill.drill.id}_${planDrill.duration}`;
  }
}
