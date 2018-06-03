import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

import {DrillFocus, DrillsState, Drill, Animation} from '../model/types';
import { Store } from '@ngrx/store';
import { LoadAnimation, getAnimations } from '../model/model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'drills-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditDrillComponent implements OnInit {
  readonly form: FormGroup;
  readonly levels = [
    {viewValue: 'Beginner', value: 1},
    {viewValue: 'Intermediate', value: 2},
    {viewValue: 'Advanced', value: 3},
    {viewValue: 'Expert', value: 4},
    {viewValue: 'Professional', value: 5},
  ];

  readonly phases = [
    {viewValue: 'Phase I', value: 1},
    {viewValue: 'Phase II', value: 2},
    {viewValue: 'Phase III', value: 3},
    {viewValue: 'Phase IV', value: 4},
    {viewValue: 'Phase V', value: 5},
  ];
  readonly focuses = Object.keys(DrillFocus).filter(key => isNaN(Number(DrillFocus[key])));

  readonly durations = [1, 2, 5, 10, 15, 20, 25, 30, 45, 60];
  readonly items: Observable<DrillsState>;

  currentDrillDoc: AngularFirestoreDocument<DrillsState>;
  drillId: string;

  constructor(
      private readonly fb: FormBuilder, private readonly db: AngularFirestore,
      route: ActivatedRoute, private readonly router: Router,
    private readonly store: Store<{}>) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      minLevel: [this.levels[0], Validators.required],
      maxLevel: [this.levels[0], Validators.required],
      focus: [],
      duration: [this.durations[0], Validators.required],
      phase: [this.phases[0], Validators.required],
      minPlayers: [0, Validators.required],
      maxPlayers: [0, Validators.required],
      idealPlayers: [0, Validators.required],
    });
    route.params.subscribe((params: Params) => {
      this.drillId = params['id'];
      if (this.drillId !== undefined) {
        this.currentDrillDoc = this.db.doc(`drills/${this.drillId}`);
        this.currentDrillDoc.valueChanges().subscribe((drill) => {
          if (!drill) {
            return;
          }
          this.store.dispatch(new LoadAnimation(drill.animations[0]));
          // this.store.dispatch(new LoadAnimation({
          //   entities: [],
          //   actions: [],
          // }));
          this.form.get('name')!.setValue(drill.name);
          this.form.get('description')!.setValue(drill.description);
          this.form.get('minLevel')!.setValue(drill.minLevel);
          this.form.get('maxLevel')!.setValue(drill.maxLevel);
          this.form.get('focus')!.setValue(drill.focus);
          this.form.get('duration')!.setValue(drill.duration);
          this.form.get('phase')!.setValue(drill.phase);
          this.form.get('minPlayers')!.setValue(drill.minPlayers);
          this.form.get('maxPlayers')!.setValue(drill.maxPlayers);
          this.form.get('idealPlayers')!.setValue(drill.idealPlayers);
        });
      }
    });
  }

  ngOnInit() {}

  save() {
    if (!this.form.valid) {
      alert('Please fix form errors before saving.');
    }
  let currentAnimations: Animation[]|null = null;
    this.store.select(getAnimations).pipe(take(1)).subscribe((animations) => {
      currentAnimations = animations;
    });
    if (!currentAnimations) {
      currentAnimations = [{entities: [], actions: []}];
    }
    const drill: Drill = {
      name: this.form.get('name')!.value,
      description: this.form.get('description')!.value,
      minLevel: this.form.get('minLevel')!.value,
      maxLevel: this.form.get('maxLevel')!.value,
      focus: this.form.get('focus')!.value,
      duration: this.form.get('duration')!.value,
      phase: this.form.get('phase')!.value,
      minPlayers: this.form.get('minPlayers')!.value,
      maxPlayers: this.form.get('maxPlayers')!.value,
      idealPlayers: this.form.get('idealPlayers')!.value,
      animations: currentAnimations,
    };
    if (this.drillId !== undefined) {
      this.currentDrillDoc.update(drill).then((id) => {
        alert('Updated Successfully');
      }).catch((err) => {
        alert('Error updating!');
      });
    } else {
      this.db.collection('drills').add(drill).then((doc) => {
        this.router.navigateByUrl(`edit/${doc.id}`);
      }).catch((err) => {
        alert('Error adding');
      });
    }
  }

  delete() {
    this.currentDrillDoc.delete().then(() => {
      alert('Deleted!');
      this.router.navigateByUrl('/');
    }).catch((err) => {
      alert('Error deleting');
      console.error(err);
    });
  }
}
