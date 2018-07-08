import { Component, OnInit, Input } from '@angular/core';
import { Drill, LEVELS, DrillWithId, Environment } from '../app/model/types';
import { Store } from '@ngrx/store';
import { LoadAnimation, maxAnimationLength } from '../app/model/model';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'drills-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  readonly levels = LEVELS;
  readonly Environment = Environment;

  @Input() drill: Drill;
  @Input() startExpanded = false;

  max: Observable<number>;

  constructor(private readonly store: Store<{}>) {
  }

  ngOnInit() {
    this.max = this.store.select(maxAnimationLength);
  }


  getLevelLabel(drill: Drill): string {
    const minLevel = this.getLevelName(drill.minLevel);
    const maxLevel = this.getLevelName(drill.maxLevel);
    if (minLevel === maxLevel) {
      return minLevel;
    }
    return `${minLevel} - ${maxLevel}`;
  }
  getLevelName(val: number): string {
    const level = this.levels.find((tempLevel) => tempLevel.value === val);
    if (!level) {
      return 'Any';
    }
    if (level.shortViewValue) {
      return level.shortViewValue;
    }
    return level.viewValue;
  }

  drillOpened(drill: Drill) {
    this.store.dispatch(new LoadAnimation(drill.animations[0]));
  }

}
