// Things that don't work:
// - Assigning possession to an entity that is already on the court. You can only give a ball
//   to someone if you are dragging it in from the legend.
// - You can't remove possessions, once it is set it is permanent.
import {Action, createSelector, MemoizedSelector} from '@ngrx/store';
import {InitialState} from '@ngrx/store/src/models';
import {last} from 'rxjs/operators';
import {sampleState} from './json';

export enum BallActions {
  SET = 'set',
  SPIKE = 'spike',
  BUMP = 'bump',
  PICK_UP = 'pick_up'
}

export enum PlayerActions {
  JUMP = 'jump',
  MOVE = 'move'
}

export type EntityActionType = BallActions|PlayerActions;

export interface AnimationEndPosition {
  type: 'POSITION';
  endPos: Position;
}

export interface AnimationEndEntity {
  type: 'ENTITY';
  entityId: number;
}

export type AnimationEnd = AnimationEndPosition|AnimationEndEntity;

// Each frame is a function of the Entities and Actions that are defined in the state.
//
// The first frame is decided by the explicit starting position of each entity.
//
// The next frame is decided by going through each action and filtering out those that don't have a
// start and end time that encompasses that frame. For the remaining actions, the position will be
// interpolated by looking at the end position of the action and how long the action is. For
// example, if the action is to bump the ball 10 feet to the left in 5 frames, then the ball will
// move 2 feet to the left.
//
// Some actions will behave differently for different entities. For example, bumping a ball will
// move the ball, but the player will stay still and move only their arms.
//
// An action will always have a well-defined start and end time. However, it is tricky to define
// where that action starts and ends.
//

//
// Every action has a source (which must be of type player), a type (spike, set, jump, shuffle,
// etc...), and a target (a position or entity).
export interface EntityAction {
  sourceId: number;
  type: BallActions|PlayerActions;
  /** The starting keyframe of the action, exclusive. */
  startFrame: number;
  /** The ending keyframe of the action, exclusive. */
  endFrame: number;
  /**
   * We decided to go away from this and make it a separate action, but we might bring it back.
   * The starting keyframe for the player to prepare to take the action, e.g.
   * moving to the ball to set it. If unset, there is no player set for this action yet.
   */
  // playerStartFrame?: number;
  end: AnimationEnd;
  actionId: number;
  entityIds: Set<number>;
}

export interface Possession {
  ballId: number;
  playerId: number;
  startFrame: number;
  /** An end frame, if the possession is relenquished. If it is not, then this is undefined. */
  endFrame?: number;
}

export enum DrillFocus {
  PASSING = 'Passing',
  SETTING = 'Setting',
  HITTING = 'Hitting',
  DEFENSE = 'Defense',
  BLOCKING = 'Blocking',
  TRANSITION = 'Transition',
  READING = 'Reading',
  SERVING = 'Serving'
}

export interface DrillsState {
  // State about the drill itself
  entities: Entity[];
  actions: EntityAction[];
  possessions: Possession[];
  name: string;
  description: string;
  /** A number between 1 and 5 representing how difficult the drill is. */
  level: number;
  focus: DrillFocus[];
  /** An average duration of the drill, in minutes  */
  duration: number;
  /** A number between 1 and 5 indicating which phase the drill happens. */
  phase: number;
  /** The minimum number of players required for this drill */
  minPlayers: number;
  /** The maximum number of players for this drill */
  maxPlayers: number;
  /** The ideal number of players for this drill */
  idealPlayers: number;

  // Playback state (could probably be a different store)
  /** The currently selected entity ID, if any. */
  selectedEntityId?: number;
  keyframeIndex: number;
  speed: number;
  interpolate: number;
  past: number;
}

export enum EntityType {
  VOLLEYBALL = 'volleyball',
  PLAYER = 'player'
}

export interface Position {
  posX: number;
  posY: number;
}

export interface Entity {
  id: number;
  type: EntityType;
  icon: string;
  start: Position;
}

export const initialState: DrillsState = {
  entities: [],
  actions: [],
  possessions: [],
  name: 'Sample Drill',
  description: '',
  /** A number between 1 and 5 representing how difficult the drill is. */
  level: 1,
  focus: [],
  /** An average duration of the drill, in minutes  */
  duration: 10,
  /** A number between 1 and 5 indicating which phase the drill happens. */
  phase: 1,
  /** The minimum number of players required for this drill */
  minPlayers: 1,
  /** The maximum number of players for this drill */
  maxPlayers: 1,
  /** The ideal number of players for this drill */
  idealPlayers: 1,
  keyframeIndex: 0,
  speed: 30,
  interpolate: 0,
  past: 0
};

export function getId(entity: Entity, offset: number): string {
  return `${entity.id}-${offset}`;
}

export const ADD_ENTITY = 'ADD_ENTITY';

export class AddEntity implements Action {
  readonly type = ADD_ENTITY;
  constructor(
      readonly entity: {type: EntityType; icon: string; start: Position},
      readonly possessionPlayerId?: number) {}
}

export const ADD_ACTION = 'ADD_ACTION';

export class AddAction implements Action {
  readonly type = ADD_ACTION;
  constructor(readonly end: AnimationEnd, readonly possessionPlayerId?: number) {}
}

export const DELETE_ACTION = 'DELETE_ACTION';

export class DeleteAction implements Action {
  readonly type = DELETE_ACTION;
  constructor(readonly actionId: number) {}
}

export const SET_POSITION = 'SET_POSITION';

export class SetPosition implements Action {
  readonly type = SET_POSITION;
  constructor(readonly entityId: number, readonly offset: number, readonly position: Position) {}
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
  constructor(readonly id?: number, readonly keyframe?: number) {}
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

export class PossessSelected implements Action {
  readonly type = POSSESS_SELECTED;
  constructor(readonly entityId: number) {}
}
export type ActionTypes =
    |ChangeAction|ChangeActionEnd|AddEntity|AddAction|UpdateKeyframeIndex|SpeedChange|NextFrame|
    DeleteEntity|SetPosition|InterpolateChange|PastChange|SelectEntity|PossessSelected|DeleteAction;

export const getDrillsState = createSelector(
    (state: {drillsState: DrillsState}) => state.drillsState,
    (drillsState: DrillsState) => drillsState);

export const getEntities = createSelector(getDrillsState, drillsState => drillsState.entities);

export const getKeyframeIndex =
    createSelector(getDrillsState, drillsState => drillsState.keyframeIndex);

export const getActions = createSelector(getDrillsState, drillsState => drillsState.actions);

export const getInterpolate =
    createSelector(getDrillsState, drillsState => drillsState.interpolate);

export const getPast = createSelector(getDrillsState, drillsState => drillsState.past);

export const getSelectedEntityId =
    createSelector(getDrillsState, drillsState => drillsState.selectedEntityId);

export const getDrawState = createSelector(
    getEntities, getKeyframeIndex, getInterpolate, getActions, getPast, getSelectedEntityId,
    (entities, keyframeIndex, interpolate, actions, past) =>
        ({entities, keyframeIndex, interpolate, actions, past}));

export const maxAnimationLength = createSelector(
    getDrillsState, drillsState => Math.max(...drillsState.actions.map(action => action.endFrame)));

export const currentEntity: MemoizedSelector<{drillsState: DrillsState}, Entity|undefined> =
    createSelector(getDrillsState, drillsState => {
      if (drillsState.selectedEntityId == null) {
        return undefined;
      }
      return drillsState.entities[drillsState.selectedEntityId];
    });

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

export function actionForKeyframe(
    entity: Entity, actions: EntityAction[], keyframeIndex: number): EntityAction|undefined {
  return actions.find(
      action => action.startFrame < keyframeIndex && action.endFrame >= keyframeIndex &&
          action.entityIds.has(entity.id));
}

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

function startPositionForAction(
    entities: Entity[], entity: Entity, actions: EntityAction[], keyframe: number): Position {
  // Sort the actions from start to finish
  const sorted = actions.filter(action => action.entityIds.has(entity.id))
                     .sort((a, b) => b.endFrame - a.endFrame);
  // Find the most recent action.
  for (const action of sorted) {
    if (action.endFrame <= keyframe) {
      if (action.end.type === 'POSITION') {
        return action.end.endPos;
      } else {
        return startPositionForAction(entities, entities[action.end.entityId], actions, keyframe);
      }
    }
  }
  return entity.start;
}

function hasPossessionAtKeyframe(keyframe: number, possession: Possession) {
  return possession.startFrame <= keyframe &&
      (possession.endFrame === undefined || possession.endFrame >= keyframe);
}

export function positionForKeyFrame(
    entities: Entity[], entity: Entity, actions: EntityAction[], keyframe: number): Position|null {
  const lastPosition = startPositionForAction(entities, entity, actions, keyframe);
  const currentAction = actionForKeyframe(entity, actions, keyframe);
  if (!currentAction) {
    // We are not currently in an action, so just return the position of the most recent action.
    return lastPosition;
  }
  // Finally, compute the interpolation and return the keyframe.
  // const length = currentaction.end - currentaction.start;
  const length = currentAction.endFrame - currentAction.startFrame;
  const index = keyframe - currentAction.startFrame;

  let actionEndPosition: Position|null = null;
  switch (currentAction.end.type) {
    case 'POSITION':
      actionEndPosition = currentAction.end.endPos;
      break;
    case 'ENTITY':
      actionEndPosition = positionForKeyFrame(
          entities, entities[currentAction.end.entityId], actions, currentAction.endFrame);
      break;
    default:
      return ((assertUnreachable: never) => ({posX: 0, posY: 0}))(currentAction.end);
  }
  if (!actionEndPosition) {
    throw new Error('Unable to get end position for action');
  }
  return {
    posX: lastPosition.posX + (actionEndPosition.posX - lastPosition.posX) / length * index,
    posY: lastPosition.posY + (actionEndPosition.posY - lastPosition.posY) / length * index
  };
}

let nextEntityId = 0;
// "Ensure" that the Entity and Action IDs don't collide.
let nextActionId = 1000;
export function drillsReducer(state: DrillsState = initialState, action: ActionTypes): DrillsState {
  switch (action.type) {
    case ADD_ENTITY: {
      while (state.entities.some(entity => entity.id === nextEntityId)) {
        nextEntityId++;
      }
      if (action.possessionPlayerId != null) {
        return {
          ...state,
          selectedEntityId: state.entities.length,
          entities: state.entities.concat([{...action.entity, id: nextEntityId}]),
          possessions: [
            ...state.possessions, {
              playerId: action.possessionPlayerId,
              ballId: nextEntityId,
              startFrame: state.keyframeIndex
            }
          ],
        };
      }
      return {
        ...state,
        selectedEntityId: state.entities.length,
        entities: state.entities.concat([{...action.entity, id: nextEntityId}])
      };
    }
    case SET_POSITION: {
      // 1. Find the new position that we want to move the entity to.
      const keyframe = state.keyframeIndex - action.offset;
      const keyframeEntity = state.entities.find(entity => entity.id === action.entityId);
      if (!keyframeEntity) {
        console.error('Tried to set position for null keyframe entity');
        return state;
      }
      const keyframeAction = actionForKeyframe(keyframeEntity, state.actions, keyframe);
      // Collect all the entities that we need to update.
      // TODO make the starting position optionally be of type Entity as well.
      const attachedEntities: Entity[] = [keyframeEntity];
      for (const tempPossession of state.possessions) {
        if (!hasPossessionAtKeyframe(keyframe, tempPossession)) {
          continue;
        }
        if (tempPossession.ballId === keyframeEntity.id) {
          const entity = state.entities[tempPossession.playerId];
          if (!entity) {
            throw new Error(`Possession by unknown player with ID ${tempPossession.playerId}`);
          }
          attachedEntities.push(entity);
        } else if (tempPossession.playerId === keyframeEntity.id) {
          const entity = state.entities[tempPossession.ballId];
          if (!entity) {
            throw new Error(`Possession of unknown ball with ID ${tempPossession.ballId}`);
          }
          attachedEntities.push(entity);
        }
      }
      if (!keyframeAction) {
        // This means we are just setting the start position. Make sure we do so for this entity and
        // any possessions.
        for (const entity of attachedEntities) {
          const tempAction = actionForKeyframe(entity, state.actions, keyframe);
          if (!tempAction) {
            entity.start = {posX: action.position.posX, posY: action.position.posY};
            continue;
          }
          if (tempAction.end.type === 'POSITION') {
            tempAction.end.endPos = {posX: action.position.posX, posY: action.position.posY};
          } else {
            // Don't do anything, this means that it was an entity with an attached position.
          }
        }
        return {
          ...state,
          entities: state.entities.map(entity => {
            const shouldUpdate = attachedEntities.find((attached) => attached === entity);
            if (shouldUpdate) {
              return {...shouldUpdate};
            }
            return entity;
          })
        };
      } else {
        // Interpolate from the position of the entity at that keyframe to the end.
        // Note that the percentage might actually be 1 - that's fine, the logic is the same.
        const percent = 1 - (percentOfActionHelper(keyframeAction, keyframe) || 0);
        if (!percent) {
          console.warn('wtf?');
          return state;
        }
        const startPosition =
            startPositionForAction(state.entities, keyframeEntity, state.actions, keyframe);
        const animationLength = keyframeAction.endFrame - keyframeAction.startFrame;
        const newY = (action.position.posY - startPosition.posY) / percent + startPosition.posY;
        const newX = (action.position.posX - startPosition.posX) / percent + startPosition.posX;
        for (const entity of attachedEntities) {
          const tempAction = actionForKeyframe(entity, state.actions, keyframe);
          if (!tempAction) {
            entity.start = {posX: newX, posY: newY};
            continue;
          }
          if (tempAction.end.type === 'POSITION') {
            tempAction.end.endPos = {posX: newX, posY: newY};
          } else {
            // Don't do anything, this means that it was an entity with an attached position.
          }
        }
      }
      return {
        ...state,
        entities: state.entities.map(entity => {
          if (entity.id === action.entityId) {
            return keyframeEntity;
          }
          return entity;
        })
      };
    }
    case ADD_ACTION: {
      if (state.selectedEntityId == null) {
        throw new Error('Tried to add action, but no entities were selected');
      }
      const framesToAdd = state.interpolate === 0 ? 1 : state.interpolate;
      const newAction: EntityAction = {
        type: PlayerActions.MOVE,
        sourceId: state.selectedEntityId,
        end: action.end,
        startFrame: state.keyframeIndex,
        endFrame: state.keyframeIndex + framesToAdd,
        actionId: nextActionId++,
        entityIds: new Set([state.selectedEntityId])
      };
      const ret = {
        ...state,
        actions: [...state.actions, newAction],
        keyframeIndex: state.keyframeIndex + framesToAdd,
        interpolate: 1,
        past: framesToAdd,
      };
      /* TODO support moving with the ball */
      ret.possessions = ret.possessions.map((possession) => {
        if (hasPossessionAtKeyframe(state.keyframeIndex, possession)) {
          if (possession.playerId === action.possessionPlayerId) {
            /* This is a new action, but the player is still keeping possession. */
            return possession;
          } else if (
              possession.playerId === state.selectedEntityId ||
              possession.ballId === state.selectedEntityId) {
            return {...possession, endFrame: state.keyframeIndex};
          }
        }
        return possession;
      });
      if (action.possessionPlayerId != null) {
        ret.possessions = [
          ...ret.possessions.filter(
              (possession) => possession.startFrame !== state.keyframeIndex ||
                  possession.playerId !== action.possessionPlayerId),
          {
            playerId: action.possessionPlayerId,
            ballId: state.selectedEntityId,
            startFrame: state.keyframeIndex
          }
        ];
      }
      return ret;
    }
    case DELETE_ACTION:
      return {
        ...state,
        actions: state.actions.filter((tempAction) => tempAction.actionId !== action.actionId),
        keyframeIndex: Math.min(maxAnimationLength.projector(state), state.keyframeIndex),
      };
    case POSSESS_SELECTED:
      // NOTE: CURRENTLY UNUSED
      if (state.selectedEntityId == null) {
        throw new Error('Tried to take possession with no entity selected');
      }
      return {
        ...state,
        possessions: [
          ...state.possessions.filter(
              (possession) => possession.startFrame !== state.keyframeIndex ||
                  possession.playerId !== action.entityId),
          {
            playerId: action.entityId,
            ballId: state.selectedEntityId,
            startFrame: state.keyframeIndex
          }
        ]
      };
    case UPDATE_KEYFRAME_INDEX:
      return {...state, keyframeIndex: action.index};
    case SPEED_CHANGE:
      return {...state, speed: action.speed};
    case INTERPOLATE_CHANGE:
      return {...state, interpolate: action.interpolate};
    case PAST_CHANGE:
      return {...state, past: action.val};
    case NEXT_FRAME:
      const maxLength = maxAnimationLength.projector(state);
      if (maxLength === 0) {
        return state;
      }
      return {...state, keyframeIndex: (state.keyframeIndex + 1) % (maxLength + 1)};
    case DELETE_ENTITY:
      return {...state, entities: state.entities.filter(entity => entity.id !== action.entityId)};
    case SELECT_ENTITY: {
      if (state.selectedEntityId === action.id && action.keyframe === undefined) {
        return state;
      }
      const actionEntity = currentEntity({drillsState: state});
      if (actionEntity == null) {
        throw new Error('Failed to select entity');
      }
      const currentAction = actionForKeyframe(
          actionEntity, state.actions, state.keyframeIndex - (action.keyframe || 0));
      if (!currentAction) {
        return {...state, selectedEntityId: action.id};
      }
      return {
        ...state,
        selectedEntityId: action.id,
        past: state.keyframeIndex - currentAction.startFrame,
        interpolate: currentAction.endFrame - state.keyframeIndex
      };
    }
    case CHANGE_ACTION: {
      const currentAction: EntityAction|undefined =
          state.actions.find(tempAction => tempAction.actionId === action.actionId);
      if (currentAction == null) {
        throw new Error('Tried to change action when none was selected');
      }
      return {
        ...state,
        actions: state.actions.map(tempAction => {
          if (tempAction.actionId === currentAction.actionId) {
            return {...tempAction, type: action.actionType};
          }
          return tempAction;
        })
      };
    }
    case CHANGE_ACTION_END: {
      if (state.selectedEntityId === undefined) {
        console.error('Tried to change action when no entity was selected');
        return state;
      }
      // const actionEntity = state.entities[state.selectedEntityId];
      const currentAction: EntityAction|undefined =
          state.actions.find(tempAction => tempAction.actionId === action.actionId);
      console.log(currentAction);
      if (currentAction == null) {
        throw new Error('Tried to change action when none was selected');
      }
      const endDistance = currentAction.endFrame - action.end;
      return {
        ...state,
        actions: state.actions.map(tempAction => {
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
        keyframeIndex: currentAction.endFrame,
        past: currentAction.endFrame - currentAction.startFrame
      };
    }
    default:
      return ((assertUnreachable: never) => state)(action);
  }
}
