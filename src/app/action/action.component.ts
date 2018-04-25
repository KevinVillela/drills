import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EntityAction, PlayerActions, BallActions, Entity, EntityActionType, getCurrentAction, ChangeAction, currentEntity, EntityType, ChangeActionLength } from '../model/model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'drills-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionComponent implements OnInit {

  readonly actionTypes: Observable<EntityActionType[]>
  readonly currentAction: Observable<EntityAction | undefined>;
  readonly start: Observable<number>;
  readonly end: Observable<number>;

  constructor(private readonly store: Store<{}>) {
    this.currentAction = store.select((getCurrentAction));
    this.actionTypes = store.select(currentEntity).pipe(map((entity: Entity | undefined) => {
      if (!entity) {
        return [];
      }
      if (entity.type === EntityType.VOLLEYBALL) {
        return Object.keys(BallActions);
      }
      return Object.keys(PlayerActions);
    }),
      map((actions) => actions.map((action) => action.toLowerCase() as EntityActionType)));
    this.start = this.currentAction.pipe((map((action) => {
      if (!action) {
        return 0;
      }
      return action.animation.start;
    })));
    this.end = this.currentAction.pipe((map((action) => {
      if (!action) {
        return 0;
      }
      return action.animation.end;
    })));
  }

  ngOnInit() {
  }

  onLengthChange(start: number, end: number): void {
    this.store.dispatch(new ChangeActionLength(start, end));
  }

  onActionTypeChange(val: EntityActionType) {
    this.store.dispatch(new ChangeAction(val));
  }
}
