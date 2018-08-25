import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Store} from '@ngrx/store';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

import {LoadAnimation, maxAnimationLength} from '../app/model/model';
import {Drill, DrillWithId, Environment, LEVELS, INTENSITIES} from '../app/model/types';
import {DatabaseService} from '../database.service';
import { MatSnackBar } from '../../node_modules/@angular/material';

@Component({
  selector : 'drills-preview',
  templateUrl : './preview.component.html',
  styleUrls : [ './preview.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit {
  readonly levels = LEVELS;
  readonly intensities = INTENSITIES;
  readonly Environment = Environment;

  @Input() drill: Drill;
  @Input() startExpanded = false;

  max: Observable<number>;

  constructor(private readonly store: Store<{}>, private readonly db: DatabaseService,
  private readonly snackBar: MatSnackBar) {}

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

  getIntensityName(val: number): string {
    const intensity = this.intensities.find((tmp) => tmp.value === val);
    if (!intensity) {
      return '';
    }
    return intensity.viewValue;
  }

  drillOpened(drill: Drill) { this.store.dispatch(new LoadAnimation(drill.animations[0])); }

  delete() {
    if (!this.drill.id) {
      console.error('Tried to delete drill with no ID');
      return;
    }
    this.db.deleteDrill(this.drill.id)
        .then(() => {
          this.snackBar.open('Deleted!', '', {duration: 1000});
        })
        .catch((err) => {
          this.snackBar.open('Error deleting', '', {duration: 1000});
        });
  }
}
