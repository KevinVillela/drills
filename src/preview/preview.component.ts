import { Component, OnInit, Input } from '@angular/core';
import { Drill, LEVELS, DrillWithId } from '../app/model/types';
import { Store } from '@ngrx/store';
import { LoadAnimation } from '../app/model/model';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'drills-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  readonly levels = LEVELS;

  @Input() drill: Drill;

  constructor(private readonly store: Store<{}>) {
  }

  ngOnInit() {
  }


  getLevelLabel(drill: Drill): string {
    const minLevel = this.getLevelName(drill.minLevel);
    const maxLevel = this.getLevelName(drill.maxLevel);
    if (minLevel === maxLevel) {
      return minLevel;
    }
    return `${minLevel} to ${maxLevel}`;
  }
  getLevelName(val: number): string {
    const level = this.levels.find((tempLevel) => tempLevel.value === val);
    if (!level) {
      return 'Any';
    }
    return level.viewValue;
  }

  drillOpened(drill: Drill) {
    this.store.dispatch(new LoadAnimation(drill.animations[0]));
  }

}
