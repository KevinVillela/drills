import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {take} from 'rxjs/operators';

import {getAnimations, LoadAnimation, NextEntityColor, Rotate, getCurrentAction} from '../model/model';
import {
  Animation,
  Drill,
  DrillFocus,
  DrillsState,
  Environment,
  ENVIRONMENTS,
  FOCUSES,
  LEVELS,
  PHASES,
  EntityAction
} from '../model/types';

@Component({
  selector : 'drills-edit',
  templateUrl : './edit.component.html',
  styleUrls : [ './edit.component.css' ]
})
export class EditDrillComponent implements OnInit {
  readonly form: FormGroup;
  readonly levels = LEVELS;

  readonly phases = PHASES;

  readonly focuses = FOCUSES;
  readonly environments = ENVIRONMENTS;

  readonly durations = [ 1, 2, 5, 10, 15, 20, 25, 30, 45, 60 ];
  readonly items: Observable<DrillsState>;
  readonly currentAction: Observable<EntityAction|undefined>;

  currentDrillDoc: AngularFirestoreDocument<DrillsState>;
  drillId: string;

  constructor(private readonly fb: FormBuilder, private readonly db: AngularFirestore,
              route: ActivatedRoute, private readonly router: Router,
              private readonly store: Store<{}>) {

    this.currentAction = store.select((getCurrentAction));
    document.addEventListener('keydown', (event) => {

      switch (event.key) {
        case 'c':
        this.store.dispatch(new NextEntityColor());
        break;
        case 'r':
        this.store.dispatch(new Rotate(this.getActionIdOrDie(), 90));
        break;
        case 'R':
        this.store.dispatch(new Rotate(this.getActionIdOrDie(), -90));
        break;
        case 's':
          if (event.metaKey) {
            event.preventDefault();
            this.save();
          }
          break;
      }
    });
    this.form = this.fb.group({
      name : [ '', Validators.required ],
      description : [ '', Validators.required ],
      environment : [],
      minLevel : [ this.levels[0], Validators.required ],
      maxLevel : [ this.levels[0], Validators.required ],
      focus : [],
      duration : [ this.durations[0], Validators.required ],
      phase : [ this.phases[0], Validators.required ],
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
        this.currentDrillDoc = this.db.doc(`drills/${this.drillId}`);
        this.currentDrillDoc.valueChanges().subscribe((drill) => {
          if (!drill) {
            return;
          }
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
          this.getForm('minPlayers').setValue(drill.minPlayers);
          this.getForm('maxPlayers').setValue(drill.maxPlayers);
          this.getForm('idealPlayers').setValue(drill.idealPlayers);
          this.getForm('verified').setValue(drill.verified || false);
        });
      }
    });
  }

  private getActionIdOrDie(): number {
    let id: undefined|number;
    this.currentAction.pipe(take(1)).subscribe((val) => {
      if (val) {
        id = val.id;
      }
    });
    if (id == null) {
      throw new Error('Could not get action ID');
    }
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
      alert('Please fix form errors before saving.');
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
      minPlayers : this.getForm('minPlayers').value,
      maxPlayers : this.getForm('maxPlayers').value,
      idealPlayers : this.getForm('idealPlayers').value,
      verified : this.getForm('verified').value,
      animations : currentAnimations,
    };
    if (this.drillId !== undefined) {
      this.currentDrillDoc.update(drill)
          .then((id) => { alert('Updated Successfully'); })
          .catch((err) => { alert('Error updating!'); });
    } else {
      this.db.collection('drills')
          .add(drill)
          .then((doc) => { this.router.navigateByUrl(`edit/${doc.id}`); })
          .catch((err) => { alert('Error adding'); });
    }
  }

  delete() {
    this.currentDrillDoc.delete()
        .then(() => {
          alert('Deleted!');
          this.router.navigateByUrl('/');
        })
        .catch((err) => {
          alert('Error deleting');
          console.error(err);
        });
  }
}
