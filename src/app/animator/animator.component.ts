import { Component, OnInit, Input } from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {interval} from 'rxjs/observable/interval';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {getPast, InterpolateChange, maxAnimationLength, NextFrame, PastChange, SpeedChange, UpdateKeyframeIndex} from '../model/model';
import {DrillsState} from '../model/types';

@Component({
  selector: 'drills-animator',
  templateUrl: './animator.component.html',
  styleUrls: ['./animator.component.css']
})
export class AnimatorComponent {
  max: Observable<number>;
  keyframeIndex: Observable<number>;
  past: Observable<number>;

  constructor(private readonly store: Store<{drillsState: DrillsState}>) {
    this.max = store.select(maxAnimationLength);
    this.keyframeIndex = store.select((state) => state.drillsState.keyframeIndex);
    this.past = store.select(getPast);
  }

  onSpeedChange(change: MatSliderChange) {
    if (change.value == null) {
      throw new Error('Speed change event value was null');
    }
    this.store.dispatch(new SpeedChange(change.value));
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
}
