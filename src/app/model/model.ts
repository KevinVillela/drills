// Things that don't work:
// - Possessions can have a maximum or two entities, and one of these must be
//   absolute positioned, although this is not enforced by the reducers yet.
// - You can't remove possessions, once it is set it is permanent.
import {Action, createSelector, MemoizedSelector} from '@ngrx/store';
import {InitialState} from '@ngrx/store/src/models';
import {last} from 'rxjs/operators';

import {
  actionForKeyframe,
  entityWithId,
  entityWithIdOrDie,
  getPossessions,
  hasPossessionAtKeyframe,
  lastActionForKeyframe,
  losesPossession,
  startPositionForAction
} from './animation';
import {sampleState} from './json';
import {AnimationEndPosition, Position} from './types';
import {
  Animation,
  AnimationEnd,
  BallActions,
  DrillsState,
  Entity,
  EntityAction,
  EntityActionType,
  EntityType,
  PlayerActions,
  Possession
} from './types';

export const initialState: DrillsState = {
  animations : [ {
    entities : [],
    actions : [],
  } ],
  name : 'Sample Drill',
  description : '',
  minLevel : 1,
  maxLevel : 1,
  focus : [],
  /** An average duration of the drill, in minutes  */
  duration : 10,
  /** A number between 1 and 5 indicating which phase the drill happens. */
  phase : 1,
  /** The minimum number of players required for this drill */
  minPlayers : 1,
  /** The maximum number of players for this drill */
  maxPlayers : 1,
  /** The ideal number of players for this drill */
  idealPlayers : 1,
  keyframeIndex : 0,
  speed : 30,
  interpolate : 0,
  past : 0
};

export function getId(entity: Entity, offset: number): string { return `${entity.id}-${offset}`; }

export const ADD_ENTITY = 'ADD_ENTITY';

export class AddEntity implements Action {
  readonly type = ADD_ENTITY;
  constructor(readonly entity: {type: EntityType; icon: string; start: AnimationEnd},
              readonly targetId?: number) {}
}

export const ADD_ACTION = 'ADD_ACTION';

export class AddAction implements Action {
  readonly type = ADD_ACTION;
  constructor(readonly end: AnimationEnd, readonly targetId?: number) {}
}

export const DELETE_ACTION = 'DELETE_ACTION';

export class DeleteAction implements Action {
  readonly type = DELETE_ACTION;
  constructor(readonly actionId: number) {}
}

export const SET_POSITION = 'SET_POSITION';

export class SetPosition implements Action {
  readonly type = SET_POSITION;
  constructor(readonly entityId: number, readonly offset: number,
              readonly position: {posX: number, posY: number}) {}
}

export const UPDATE_KEYFRAME_INDEX = 'UPDATE_KEYFRAME_INDEX';

export class UpdateKeyframeIndex implements Action {
  readonly type = UPDATE_KEYFRAME_INDEX;
  constructor(readonly index: number) {}
}

export const SPEED_CHANGE = 'SPEED_CHANGE';

export class SpeedChange implements Action {
  readonly type = SPEED_CHANGE;
  constructor(readonly speed: number) {}
}

export const INTERPOLATE_CHANGE = 'INTERPOLATE_CHANGE';

export class InterpolateChange implements Action {
  readonly type = INTERPOLATE_CHANGE;
  constructor(readonly interpolate: number) {}
}

export const PAST_CHANGE = 'PAST_CHANGE';

export class PastChange implements Action {
  readonly type = PAST_CHANGE;
  constructor(readonly val: number) {}
}

export const NEXT_FRAME = 'NEXT_FRAME';

export class NextFrame implements Action {
  readonly type = NEXT_FRAME;
  constructor() {}
}

export const DELETE_ENTITY = 'DELETE_ENTITY';

export class DeleteEntity implements Action {
  readonly type = DELETE_ENTITY;
  constructor(readonly entityId: number) {}
}

export const SELECT_ENTITY = 'SELECT_ENTITY';

export class SelectEntity implements Action {
  readonly type = SELECT_ENTITY;
  constructor(readonly id: number, readonly keyframe?: number) {}
}

export const CHANGE_ACTION = 'CHANGE_ACTION';

export class ChangeAction implements Action {
  readonly type = CHANGE_ACTION;
  constructor(readonly actionId: number, readonly actionType: EntityActionType) {}
}

export const CHANGE_ACTION_END = 'CHANGE_ACTION_END';

export class ChangeActionEnd implements Action {
  readonly type = CHANGE_ACTION_END;
  constructor(readonly actionId: number, readonly end: number) {}
}

export const POSSESS_SELECTED = 'POSSESS_SELECTED';

/** Currently unused */
export class PossessSelected implements Action {
  readonly type = POSSESS_SELECTED;
  constructor(readonly entityId: number) {}
}

export const LOAD_ANIMATION = 'LOAD_ANIMATION';

export class LoadAnimation implements Action {
  readonly type = LOAD_ANIMATION;
  constructor(readonly animation: Animation) {}
}

export type ActionTypes =
    LoadAnimation|ChangeAction|ChangeActionEnd|AddEntity|AddAction|UpdateKeyframeIndex|SpeedChange|
    NextFrame|DeleteEntity|SetPosition|InterpolateChange|PastChange|SelectEntity|DeleteAction;

export const getDrillsState =
    createSelector((state: {drillsState: DrillsState}) => state.drillsState,
                   (drillsState: DrillsState) => drillsState);

export const getEntities =
    createSelector(getDrillsState, drillsState => drillsState.animations[0].entities);

export const getKeyframeIndex =
    createSelector(getDrillsState, drillsState => drillsState.keyframeIndex);

export const getAnimations = createSelector(getDrillsState, drillsState => drillsState.animations);
export const getActions =
    createSelector(getDrillsState, drillsState => drillsState.animations[0].actions);

export const getInterpolate =
    createSelector(getDrillsState, drillsState => drillsState.interpolate);

export const getPast = createSelector(getDrillsState, drillsState => drillsState.past);

export const getSelectedEntityId =
    createSelector(getDrillsState, drillsState => drillsState.selectedEntityId);

export const getDrawState = createSelector(
    getEntities, getKeyframeIndex, getInterpolate, getActions, getPast, getSelectedEntityId,
    (entities, keyframeIndex, interpolate, actions, past) =>
        ({entities, keyframeIndex, interpolate, actions, past}));

export const maxAnimationLength =
    createSelector(getActions, actions => maxAnimationLengthHelper(actions));

function maxAnimationLengthHelper(actions: EntityAction[]) {
  return Math.max(...actions.map(action => action.endFrame));
}
export const currentEntity: MemoizedSelector<{drillsState: DrillsState}, Entity|undefined> =
    createSelector(getDrillsState, drillsState => currentEntityHelper(drillsState));

function currentEntityHelper(drillsState: DrillsState) {
  if (drillsState.selectedEntityId == null) {
    return undefined;
  }
  return drillsState.animations[0].entities[drillsState.selectedEntityId];
}
export const getCurrentAction = createSelector(
    currentEntity, getKeyframeIndex, getActions, (entity, keyframeIndex, actions) => {
      if (entity) {
        return actionForKeyframe(entity, actions, keyframeIndex);
      }
      return undefined;
    });

// function totalAnimationLength(entity: Entity): number {
//     return Math.max(...entity.actions.map((action) => action.endFrame));
// }

export function percentOfAction(entity: Entity, actions: EntityAction[], keyframe: number): number|
    null {
  const currentAction = actionForKeyframe(entity, actions, keyframe);
  if (!currentAction) {
    return null;
  }
  return percentOfActionHelper(currentAction, keyframe);
}

export function percentOfActionHelper(action: EntityAction, keyframe: number): number|null {
  if (!action) {
    return null;
  }
  return (action.endFrame - keyframe) / (action.endFrame - action.startFrame);
}

function getNextEntityId(animation: Animation) {
  let nextEntityId = 0;
  while (animation.entities.some(entity => entity.id === nextEntityId)) {
    nextEntityId++;
  }
  return nextEntityId;
}
function getNextActionId(animation: Animation) {
  // "Ensure" that the Entity and Action IDs don't collide.
  let nextActionId = 1000;
  while (animation.actions.some((action) => action.actionId === nextActionId)) {
    nextActionId++;
  }
  return nextActionId;
}

export function drillsReducer(state: DrillsState = initialState, action: ActionTypes): DrillsState {
  const animation = state.animations[0];
  switch (action.type) {
  case LOAD_ANIMATION:
    return {...state, animations : [ action.animation ]};
  case ADD_ENTITY: {
    const nextEntityId = getNextEntityId(animation);
    if (action.targetId != null) {
      const target = entityWithId(animation.entities, action.targetId);
      if (!target) {
        console.error('Tried to give add entity on top of unknown entity ID', action.targetId);
        return state;
      }
      const possession = {
        startFrame : state.keyframeIndex,
        playerId : target.type === EntityType.PLAYER ? target.id : nextEntityId,
        ballId : target.type === EntityType.PLAYER ? nextEntityId : target.id,
      };
      return {
        ...state,
        selectedEntityId : animation.entities.length,
        animations : [ {
          ...animation,
          entities : animation.entities.concat([ {...action.entity, id : nextEntityId} ]),
        } ],
      };
    }
    return {
      ...state,
      selectedEntityId : animation.entities.length,
      animations : [ {
        ...animation,
        entities : animation.entities.concat([ {...action.entity, id : nextEntityId} ]),
      } ],
    };
  }
  case SET_POSITION: {
    // 1. Find the new position that we want to move the entity to.
    const keyframe = state.keyframeIndex - action.offset;
    const keyframeEntity = animation.entities.find(entity => entity.id === action.entityId);
    if (!keyframeEntity) {
      console.error('Tried to set position for null keyframe entity');
      return state;
    }
    const keyframeAction = lastActionForKeyframe(keyframeEntity, animation.actions, keyframe);
    if (keyframe === 0 || !keyframeAction) {
      // This means we are just setting the start position.
      let owningEntity: Entity = keyframeEntity;
      if (keyframeEntity.start.type === 'ENTITY') {
        owningEntity = entityWithIdOrDie(animation.entities, keyframeEntity.start.entityId);
      }
      owningEntity.start = {
        type : 'POSITION',
        endPos : {
          posX : action.position.posX,
          posY : action.position.posY,
        }
      };
      return {
        ...state,
        animations : [ {
          ...animation,
          entities : animation.entities.map(entity => {
            if (entity === owningEntity) {
              return {...owningEntity};
            }
            return entity;
          })
        } ],
      };
    } else {
      // Interpolate from the position of the entity at that keyframe to the end.
      // Note that the percentage might actually be 1 - that's fine, the logic is the same.
      const percent = 1 - (percentOfActionHelper(keyframeAction, keyframe) || 0);
      if (!percent) {
        console.warn('wtf?');
        return state;
      }
      const startPosition = startPositionForAction(keyframeEntity, keyframe, state);
      const animationLength = keyframeAction.endFrame - keyframeAction.startFrame;
      const newY = (action.position.posY - startPosition.posY) / percent + startPosition.posY;
      const newX = (action.position.posX - startPosition.posX) / percent + startPosition.posX;
      const newPos = {posX : newX, posY : newY};
      let owningEntity: Entity = keyframeEntity;
      let owningAction: EntityAction|undefined = keyframeAction;
      if (keyframeAction.end.type === 'POSITION') {
        keyframeAction.end.endPos = newPos;
      } else {
        if (keyframeAction.end.type === 'ENTITY') {
          owningEntity = entityWithIdOrDie(animation.entities, keyframeAction.end.entityId);
          owningAction = actionForKeyframe(owningEntity, animation.actions, keyframe);
          if (owningAction) {
            if (owningAction.end.type === 'POSITION') {
              owningAction.end.endPos = newPos;
            } else {
              throw new Error('wtf!!');
            }
          } else {
            if (owningEntity.start.type === 'POSITION') {
              owningEntity.start.endPos = newPos;
            } else {
              throw new Error('wtf??');
            }
          }
        }
      }
      return {
        ...state,
        animations : [ {
          ...animation,
          entities : animation.entities.map(entity => {
            if (entity === owningEntity) {
              return {...owningEntity};
            }
            return entity;
          }),
          actions : animation.actions.map(tempAction => {
            if (tempAction === owningAction) {
              return owningAction;
            }
            return tempAction;
          })
        } ],
      };
    }
  }
  case ADD_ACTION: {
    if (state.selectedEntityId == null) {
      throw new Error('Tried to add action, but no entities were selected');
    }
    const selectedEntity = animation.entities[state.selectedEntityId];
    if (!selectedEntity) {
      throw new Error('Tried to add action, but entity of ID ' + state.selectedEntityId +
                      ' does not exist');
    }
    const framesToAdd = state.interpolate === 0 ? 10 : state.interpolate;
    const newAction: EntityAction = {
      type : selectedEntity.type === EntityType.PLAYER ? PlayerActions.MOVE : BallActions.SPIKE,
      sourceId : state.selectedEntityId,
      end : action.end,
      startFrame : state.keyframeIndex,
      endFrame : state.keyframeIndex + framesToAdd,
      actionId : getNextActionId(animation),
    };
    const ret = {
      ...state,
      animations : [ {
        ...animation,
        actions : [...animation.actions, newAction ],
      } ],
      keyframeIndex : state.keyframeIndex + framesToAdd,
      interpolate : 0,
      past : framesToAdd,
    };
    if (action.targetId != null) {
      const target = animation.entities[action.targetId];
      if (!target) {
        console.error('Tried to target unknown entity with ID', action.targetId);
        return state;
      }
    }
    return ret;
  }
  case DELETE_ACTION: {
    const currentAction =
        animation.actions.find((tempAction) => tempAction.actionId === action.actionId);
    if (!currentAction) {
      console.error('Tried to delete invalid action of id', action.actionId);
      return state;
    }
    return {
      ...state,
      animations : [ {
        ...animation,
        actions : animation.actions.filter((tempAction) => tempAction.actionId !== action.actionId),
      } ],
      keyframeIndex : Math.min(maxAnimationLengthHelper(animation.actions), state.keyframeIndex),
    };
  }
  case UPDATE_KEYFRAME_INDEX:
    return {...state, keyframeIndex : action.index};
  case SPEED_CHANGE:
    return {...state, speed : action.speed};
  case INTERPOLATE_CHANGE:
    return {...state, interpolate : action.interpolate};
  case PAST_CHANGE:
    return {...state, past : action.val};
  case NEXT_FRAME:
    const maxLength = maxAnimationLengthHelper(animation.actions);
    if (maxLength === 0) {
      return state;
    }
    return {...state, keyframeIndex : (state.keyframeIndex + 1) % (maxLength + 1)};
  case DELETE_ENTITY:
    return {
      ...state,
      animations : [ {
        ...animation,
        entities : animation.entities.filter(entity => entity.id !== action.entityId),
        actions : animation.actions.filter(tempAction => tempAction.sourceId !== action.entityId),
      } ]
    };
  case SELECT_ENTITY: {
    if (state.selectedEntityId === action.id && action.keyframe === undefined) {
      return state;
    }
    const actionEntity = animation.entities[action.id];
    if (actionEntity == null) {
      throw new Error('Failed to select entity');
    }
    const currentAction = actionForKeyframe(actionEntity, animation.actions,
                                            state.keyframeIndex - (action.keyframe || 0));
    if (!currentAction) {
      return {...state, selectedEntityId : action.id};
    }
    return {
      ...state,
      selectedEntityId : action.id,
      past : state.keyframeIndex - currentAction.startFrame,
      interpolate : currentAction.endFrame - state.keyframeIndex
    };
  }
  case CHANGE_ACTION: {
    const currentAction: EntityAction|undefined =
        animation.actions.find(tempAction => tempAction.actionId === action.actionId);
    if (currentAction == null) {
      throw new Error('Tried to change action when none was selected');
    }
    return {
      ...state,
      animations : [ {
        ...animation,
        actions : animation.actions.map(tempAction => {
          if (tempAction.actionId === currentAction.actionId) {
            return {...tempAction, type : action.actionType};
          }
          return tempAction;
        })
      } ]
    };
  }
  case CHANGE_ACTION_END: {
    if (state.selectedEntityId === undefined) {
      console.error('Tried to change action when no entity was selected');
      return state;
    }
    const currentAction: EntityAction|undefined =
        animation.actions.find(tempAction => tempAction.actionId === action.actionId);
    console.log(currentAction);
    if (currentAction == null) {
      throw new Error('Tried to change action when none was selected');
    }
    const endDistance = currentAction.endFrame - action.end;
    return {
      ...state,
      animations : [ {
        ...animation,
        actions : animation.actions.map(tempAction => {
          if (tempAction.actionId === action.actionId) {
            // tempAction.start = action.start;
            tempAction.endFrame = action.end;
          } else {
            if (tempAction.startFrame >= currentAction.startFrame) {
              tempAction.startFrame -= endDistance;
              tempAction.endFrame -= endDistance;
            } else {
              console.log('not current action: ', tempAction.startFrame, currentAction.startFrame);
            }
            // else if (tempAction.end < currentAction.end) {
            //     tempAction.start -= startDistance;
            //     tempAction.end -= startDistance;
            // }
          }
          // tempAction.start = Math.max(0, tempAction.start);
          tempAction.endFrame = Math.max(0, tempAction.endFrame);
          return {...tempAction};
        }),
      } ],
      keyframeIndex : currentAction.endFrame,
      past : currentAction.endFrame - currentAction.startFrame
    };
  }
  default:
    return ((assertUnreachable: never) => state)(action);
  }
}
