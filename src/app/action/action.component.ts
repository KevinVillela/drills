import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatSliderChange} from '@angular/material';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {map, take} from 'rxjs/operators';

import {DeleteAction, ChangeAction, ChangeActionEnd, currentEntity,  getCurrentAction} from '../model/model';
import {BallActions, Entity, EntityAction, EntityActionType, EntityType, PlayerActions} from '../model/types';

@Component({
  selector: 'drills-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionComponent implements OnInit {
  readonly actionTypes: Observable<EntityActionType[]>;
  readonly currentAction: Observable<EntityAction|undefined>;
  readonly start: Observable<number>;
  readonly end: Observable<number>;

  constructor(private readonly store: Store<{}>) {
    this.currentAction = store.select((getCurrentAction));
    this.actionTypes = store.select(currentEntity)
                           .pipe(
                               map((entity: Entity|undefined) => {
                                 if (!entity) {
                                   return [];
                                 }
                                 if (entity.type === EntityType.VOLLEYBALL) {
                                   return Object.keys(BallActions) as BallActions[];
                                 }
                                 return Object.keys(PlayerActions) as PlayerActions[];
                               }));
    this.start = this.currentAction.pipe((map((action) => {
      if (!action) {
        return 0;
      }
      return action.startFrame;
    })));
    this.end = this.currentAction.pipe((map((action) => {
      if (!action) {
        return 0;
      }
      return action.endFrame;
    })));
  }

  ngOnInit() {}

  onLengthChange(start: number, end: number): void {
    console.warn('not hooked up');
  }

  onEndChange(end: number): void {
    const id = this.getActionId();
    if (id == null) {
      throw new Error('No action selected during end change');
    }
    this.store.dispatch(new ChangeActionEnd(id, end));
  }

  onActionTypeChange(val: EntityActionType) {
    const id = this.getActionId();
    if (id == null) {
      throw new Error('No action selected during type change');
    }
    this.store.dispatch(new ChangeAction(id, val));
  }

  delete() {
    const id = this.getActionId();
    if (id == null) {
      throw new Error('No action selected during deletion');
    }
    this.store.dispatch(new DeleteAction(id));
  }

  private getActionId(): number|undefined {
    let id: undefined|number;
    this.currentAction.pipe(take(1)).subscribe((val) => {
      if (val) {
        id = val.actionId;
      }
    });
    return id;
  }
}
