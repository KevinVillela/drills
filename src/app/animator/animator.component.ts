import {Component, Input, OnInit} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {interval} from 'rxjs/observable/interval';
import {filter, map, switchMap, take} from 'rxjs/operators';

import {
  getFuture,
  getPast,
  InterpolateChange,
  maxAnimationLength,
  NextFrame,
  PastChange,
  SpeedChange,
  UpdateKeyframeIndex,
  SetAnimation
} from '../model/model';
import {DrillsState} from '../model/types';
import { TEMPLATES, Template } from '../model/templates';

@Component({
  selector : 'drills-animator',
  templateUrl : './animator.component.html',
  styleUrls : [ './animator.component.css' ]
})
export class AnimatorComponent {
  max: Observable<number>;
  keyframeIndex: Observable<number>;
  past: Observable<number>;
  future: Observable<number>;

  templates = TEMPLATES;

  constructor(private readonly store: Store<{drillsState: DrillsState}>) {
    this.max = store.select(maxAnimationLength);
    this.keyframeIndex = store.select((state) => state.drillsState.keyframeIndex);
    this.past = store.select(getPast);
    this.future = store.select(getFuture);
  }

  onInterpolateChange(change: MatSliderChange) {
    if (change.value == null) {
      throw new Error('Interpolate change event value was null');
    }
    this.store.dispatch(new InterpolateChange(change.value));
  }

  onPastChange(change: MatSliderChange) {
    if (change.value == null) {
      throw new Error('Past change event value was null');
    }
    this.store.dispatch(new PastChange(change.value));
  }

  forward(frames: number) {
    let interpolate = 0;
    this.future.pipe(take(1)).subscribe((f) => {
      interpolate = f;
    });
    this.store.dispatch(new InterpolateChange(interpolate + frames));
  }

  insertTemplate(template: Template): void {
    this.store.dispatch(new SetAnimation(template.animation));
  }
}
