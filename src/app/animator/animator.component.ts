import { Component, OnInit } from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {interval} from 'rxjs/observable/interval';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {DrillsState, getPast, InterpolateChange, maxAnimationLength, NextFrame, PastChange, SpeedChange, UpdateKeyframeIndex} from '../model/model';

@Component({
  selector: 'drills-animator',
  templateUrl: './animator.component.html',
  styleUrls: ['./animator.component.css']
})
export class AnimatorComponent {
  max: Observable<number>;
  keyframeIndex: Observable<number>;
  playing = new BehaviorSubject<boolean>(false);
  past: Observable<number>;

  constructor(private readonly store: Store<{drillsState: DrillsState}>) {
    this.max = store.select(maxAnimationLength);
    this.keyframeIndex = store.select((state) => state.drillsState.keyframeIndex);
    combineLatest(this.playing, this.store.select((state) => state.drillsState.speed))
        .pipe(switchMap(([_, period]) => interval(period)))
        .subscribe(() => {
          if (this.playing.getValue()) {
            this.store.dispatch(new NextFrame());
          }
        });
    this.past = store.select(getPast);
  }

  onChange(change: MatSliderChange) {
    const keyframeIndex = change.value;
    if (keyframeIndex != null) {
      this.store.dispatch(new UpdateKeyframeIndex(keyframeIndex));
    }
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

  play() {
    this.store.dispatch(new InterpolateChange(0));
    this.store.dispatch(new PastChange(0));
    this.playing.next(!this.playing.getValue());
  }
}
