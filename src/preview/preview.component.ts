import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

import {LoadAnimation, maxAnimationLength} from '../app/model/model';
import {Drill, DrillWithId, Environment, LEVELS} from '../app/model/types';
import {DatabaseService} from '../database.service';

@Component({
  selector : 'drills-preview',
  templateUrl : './preview.component.html',
  styleUrls : [ './preview.component.scss' ]
})
export class PreviewComponent implements OnInit {
  readonly levels = LEVELS;
  readonly Environment = Environment;

  @Input() drill: Drill;
  @Input() startExpanded = false;

  max: Observable<number>;

  constructor(private readonly store: Store<{}>, private readonly db: DatabaseService) {}

  ngOnInit() { this.max = this.store.select(maxAnimationLength); }

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

  drillOpened(drill: Drill) { this.store.dispatch(new LoadAnimation(drill.animations[0])); }

  delete() {
    if (!this.drill.id) {
      console.error('Tried to delete drill with no ID');
      return;
    }
    this.db.deleteDrill(this.drill.id)
        .then(() => {
          alert('Deleted!');
        })
        .catch((err) => {
          alert('Error deleting');
        });
  }
}
