import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { DrillsState, UpdateKeyframeIndex, SpeedChange, NextFrame, PastChange, maxAnimationLength, InterpolateChange, getPast } from './model/model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, switchMap, take, filter } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  max: Observable<number>;
  keyframeIndex: Observable<number>;
  playing = new BehaviorSubject<boolean>(false);
  past: Observable<number>;

  constructor(private readonly store: Store<{ drillsState: DrillsState }>) {
    this.max = store.select(maxAnimationLength);
    this.keyframeIndex = store.select((state) => state.drillsState.keyframeIndex);
    combineLatest(this.playing, this.store.select((state) => state.drillsState.speed)).pipe(switchMap(([_, period]) => interval(period))).subscribe(() => {
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
    this.store.dispatch(new SpeedChange(change.value!));
  }

  onInterpolateChange(change: MatSliderChange) {
    this.store.dispatch(new InterpolateChange(change.value!));
  }

  onPastChange(change: MatSliderChange) {
    this.store.dispatch(new PastChange(change.value!));
  }

  play() {
    this.store.dispatch(new InterpolateChange(0));
    this.store.dispatch(new PastChange(0));
    this.playing.next(!this.playing.getValue());
  }

  export() {
    this.store.select((state) => state.drillsState).pipe(take(1)).subscribe((val) => {
      console.log(val);
    });
  }
}
