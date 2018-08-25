import {Component, HostListener, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {ClickEvent} from 'angular-star-rating';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {take} from 'rxjs/operators';

import {AuthService} from '../../core/auth/auth.service';
import {DatabaseService, User} from '../../database.service';
import {
  DeleteAction,
  getAnimations,
  getCurrentAction,
  LoadAnimation,
  NextEntityColor,
  Rotate
} from '../model/model';
import {
  Animation,
  Drill,
  DrillFocus,
  DrillsState,
  DURATIONS,
  EntityAction,
  Environment,
  ENVIRONMENTS,
  FOCUSES,
  LEVELS,
  PHASES,
  INTENSITIES
} from '../model/types';
import { MatSnackBar } from '../../../node_modules/@angular/material';

@Component({
  selector : 'drills-edit',
  templateUrl : './edit.component.html',
  styleUrls : [ './edit.component.css' ]
})
export class EditDrillComponent implements OnInit {
  readonly form: FormGroup;
  readonly levels = LEVELS;

  readonly phases = PHASES;
  readonly intensities = INTENSITIES;

  readonly focuses = FOCUSES;
  readonly environments = ENVIRONMENTS;

  readonly durations = DURATIONS;
  readonly items: Observable<DrillsState>;
  readonly currentAction: Observable<EntityAction|undefined>;

  drillId: string;
  creator?: Observable<User|undefined>;

  constructor(private readonly fb: FormBuilder, private readonly db: DatabaseService,
              route: ActivatedRoute, private readonly router: Router,
              private readonly store: Store<{}>, private readonly authService: AuthService,
            private readonly snackBar: MatSnackBar) {

    this.currentAction = store.select((getCurrentAction));
    this.form = this.fb.group({
      name : [ '', Validators.required ],
      description : [ '', Validators.required ],
      environment : [],
      minLevel : [ this.levels[0], Validators.required ],
      maxLevel : [ this.levels[0], Validators.required ],
      focus : [],
      duration : [ this.durations[0], Validators.required ],
      phase : [ this.phases[0], Validators.required ],
      intensity : [ this.intensities[0], Validators.required ],
      minPlayers : [ 0, Validators.required ],
      maxPlayers : [ 0, Validators.required ],
      idealPlayers : [ 0, Validators.required ],
      verified : [ false, Validators.required ],
    });
    route.params.subscribe((params: Params) => {
      this.drillId = params['id'];
      if (this.drillId == null) {
        this.store.dispatch(new LoadAnimation({
          entities : [],
          actions : [],
        }));
      } else {
        this.db.drillForId(this.drillId).subscribe((drill) => {
          if (!drill) {
            return;
          }
          this.creator = this.db.userForId(drill.creator);
          // drill.animations[0].actions = drill.animations[0].actions.map((action) => {
          //   action.rotation = {type: 'POSITION', degrees: 0};
          //   return action;
          // });
          this.store.dispatch(new LoadAnimation(drill.animations[0]));
          this.getForm('name').setValue(drill.name);
          this.getForm('description').setValue(drill.description);
          this.getForm('environment').setValue(drill.environment);
          this.getForm('minLevel').setValue(drill.minLevel);
          this.getForm('maxLevel').setValue(drill.maxLevel);
          this.getForm('focus').setValue(drill.focus);
          this.getForm('duration').setValue(drill.duration);
          this.getForm('phase').setValue(drill.phase);
          this.getForm('intensity').setValue(drill.intensity);
          this.getForm('minPlayers').setValue(drill.minPlayers);
          this.getForm('maxPlayers').setValue(drill.maxPlayers);
          this.getForm('idealPlayers').setValue(drill.idealPlayers);
          this.getForm('verified').setValue(drill.verified || false);
        });
      }
    });
  }

  @HostListener('document:keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
    const actionId = this.getActionId();
    if (actionId == null) {
      return;
    }
    switch (event.key) {
    case 'c':
      this.store.dispatch(new NextEntityColor());
      break;
    case 'r':
      this.store.dispatch(new Rotate(actionId, 90));
      break;
    case 'R':
      this.store.dispatch(new Rotate(actionId, -90));
      break;
    case 'd':
      this.store.dispatch(new DeleteAction(actionId));
      break;
    case 's':
      if (event.metaKey) {
        event.preventDefault();
        this.save();
      }
      break;
    }
  }

  private getActionId(): number|undefined {
    let id: undefined|number;
    this.currentAction.pipe(take(1)).subscribe((val) => {
      if (val) {
        id = val.id;
      }
    });
    return id;
  }

  private getForm(name: string): AbstractControl {
    const form = this.form.get(name);
    if (!form) {
      throw new Error(`Could not find form of name ${name}`);
    }
    return form;
  }

  ngOnInit() {}

  save() {
    if (!this.form.valid) {
      this.snackBar.open('Please fix form errors before saving.', '', {duration: 1000});
      return;
    }
    if (!this.authService.getUserSync()) {
      this.snackBar.open('Please log-in using the button in the top-right hand corner to save drills.', '', {duration: 1000});
      return;
    }
    let currentAnimations: Animation[]|null = null;
    this.store.select(getAnimations)
        .pipe(take(1))
        .subscribe((animations) => { currentAnimations = animations; });
    if (!currentAnimations) {
      currentAnimations = [ {entities : [], actions : []} ];
    }
    const drill: Drill = {
      name : this.getForm('name').value,
      description : this.getForm('description').value,
      environment : this.getForm('environment').value,
      minLevel : this.getForm('minLevel').value,
      maxLevel : this.getForm('maxLevel').value,
      focus : this.getForm('focus').value,
      duration : this.getForm('duration').value,
      phase : this.getForm('phase').value,
      intensity: this.getForm('intensity').value,
      minPlayers : this.getForm('minPlayers').value,
      maxPlayers : this.getForm('maxPlayers').value,
      idealPlayers : this.getForm('idealPlayers').value,
      verified : this.getForm('verified').value,
      animations : currentAnimations,
    };
    if (this.drillId !== undefined) {
      this.db.updateDrill(this.drillId, drill)
          .then((id) => { this.snackBar.open('Updated Successfully', '', {duration: 1000}); })
          .catch((err) => { this.snackBar.open('Error updating!', '' , {duration: 1000}); });
    } else {
      this.db.addDrill(drill)
          .then((doc) => { this.router.navigateByUrl(`edit/${doc.id}`); })
          .catch((err) => { this.snackBar.open('Error adding', '', {duration: 1000}); });
    }
  }

  delete() {
    this.db.deleteDrill(this.drillId)
        .then(() => {
          this.snackBar.open('Deleted!', '', {duration: 1000});
          this.router.navigateByUrl('/');
        })
        .catch((err) => {
          this.snackBar.open('Error deleting', '', {duration: 1000});
          console.error(err);
        });
  }
}
