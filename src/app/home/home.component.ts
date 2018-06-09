import {Component, OnInit, PipeTransform, Pipe, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {first, map} from 'rxjs/operators';

import {DrillsState, Environment, FOCUSES, ENVIRONMENTS, Drill, PHASES, LEVELS} from '../model/types';
import { Store } from '@ngrx/store';
import { LoadAnimation } from '../model/model';

export type DrillWithId = DrillsState&{id: string};
@Component({
  selector : 'drills-home',
  templateUrl : './home.component.html',
  styleUrls : [ './home.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  drillsCollection: AngularFirestoreCollection<DrillsState>;
  drills: Observable<DrillWithId[]>;
  readonly focuses = FOCUSES;
  readonly environments = ENVIRONMENTS;
  readonly levels = LEVELS;
  readonly phases = PHASES;

  /** The object to filter by. */
  filter: Partial<Drill> = {
    environment: [],
    focus: [],
  };

  constructor(private readonly db: AngularFirestore, private readonly router: Router,
  private readonly store: Store<{}>) {
    this.drillsCollection = db.collection('drills');
    this.drills = this.drillsCollection.snapshotChanges().pipe(
        map((snapshot) =>
                snapshot.map((snap) => ({...snap.payload.doc.data(), id : snap.payload.doc.id}))
                    .sort((snap1, snap2) => snap1.name.localeCompare(snap2.name))));
    /* this.drills.subscribe((snapshot) => {
       snapshot.forEach((drill) => {
         this.db.doc(`drills/${drill.id}`).update({...drill, environment: [Environment.BEACH]});
       });
     }); */
  }

  ngOnInit() {}

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

// export interface SearchFilter {
//   environments: Environment[];
//   levels: number[];
// }

@Pipe({
  name: 'search',
  pure: false,
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: Drill[]|null, filter: Drill) {
    return (items || []).filter((drill) => {
      if (filter.environment.length && !intersects(drill.environment, filter.environment)) {
        return false;
      }
      if (drill.maxLevel < filter.minLevel) {
        return false;
      }
      if (drill.minLevel > filter.maxLevel) {
        return false;
      }
      if (filter.focus.length && !intersects(drill.focus, filter.focus)) {
        return false;
      }
      if (filter.idealPlayers && (drill.minPlayers > filter.idealPlayers || drill.maxPlayers < filter.idealPlayers)) {
        return false;
      }
      return true;
    });
  }
}

function intersects(array1: Array<{}>, array2: Array<{}>): boolean {
  return array1.filter(value => -1 !== array2.indexOf(value)).length !== 0;
}
