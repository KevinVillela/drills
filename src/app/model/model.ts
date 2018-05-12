import { Action, createSelector, MemoizedSelector } from '@ngrx/store';
import { InitialState } from '@ngrx/store/src/models';
import { last } from 'rxjs/operators';
import { sampleState } from './json';

export enum BallActions {
    SET = 'set',
    SPIKE = 'spike',
    BUMP = 'bump',
}

export enum PlayerActions {
    JUMP = 'jump',
    MOVE = 'move',
}

export type EntityActionType = BallActions | PlayerActions;

// export type AnimationEndType = 'POSITION' | 'ENTITY';

// export interface AnimationEnd {
//     endType: AnimationEndType;
// }

// export interface AnimationEndPosition extends AnimationEnd {
//     type: 'POSITION';
//     pos: Position;
// }

// export interface AnimationEndEntity extends AnimationEnd {
//     type: 'ENTITY';
//     entityId: number;
// }

// Each frame is a function of the Entities and Actions that are defined in the state.
// 
// The first frame is decided by the explicit starting position of each entity.
// 
// The next frame is decided by going through each action and filtering out those that don't have a start and end time
// that encompasses that frame. For the remaining actions, the position will be interpolated by looking at the end
// position of the action and how long the action is. For example, if the action is to bump the ball 10 feet to the left in 5 frames,
// then the ball will move 2 feet to the left.
// 
// Some actions will behave differently for different entities. For example, bumping a ball will move the ball, but the player will
// stay still and move only their arms.
// 
// An action will always have a well-defined start and end time. However, it is tricky to define where that action starts and ends.
//

export interface EntityAction {
    type: BallActions | PlayerActions;
    animation: {
        /** The starting keyframe of the action, exclusive. */
        startFrame: number;
        /** The ending keyframe of the action, exclusive. */
        endFrame: number;
        /** 
         * The starting keyframe for the player to prepare to take the action, e.g.
         * moving to the ball to set it. If unset, there is no player set for this action yet.
         */
        playerStartFrame?: number;
        endPos: Position;
    };
    actionId: number;
    entityIds: Set<number>;
}

export interface DrillsState {
    entities: Entity[];
    actions: EntityAction[];
    /** The currently selected entity ID, if any. */
    selectedEntityId?: number;
    keyframeIndex: number;
    speed: number;
    interpolate: number;
    past: number;
}

export enum EntityType {
    VOLLEYBALL = 'volleyball',
    PLAYER = 'player',
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
    keyframeIndex: 0,
    speed: 30,
    interpolate: 0,
    past: 0,
};

export function getId(entity: Entity, offset: number): string {
    return `${entity.id}-${offset}`;
}

export const ADD_ENTITY = 'ADD_ENTITY';

export class AddEntity implements Action {
    readonly type = ADD_ENTITY;
    constructor(readonly entity: {
        type: EntityType;
        icon: string;
        start: Position;
    }) { }
}

export const ADD_ACTION = 'ADD_ACTION';

export class AddAction implements Action {
    readonly type = ADD_ACTION;
    constructor(readonly entityId: number, readonly endPos: Position) { }
}

export const SET_POSITION = 'SET_POSITION';

export class SetPosition implements Action {
    readonly type = SET_POSITION;
    constructor(readonly entityId: number, readonly offset: number, readonly position: Position) { }
}

export const UPDATE_KEYFRAME_INDEX = 'UPDATE_KEYFRAME_INDEX';

export class UpdateKeyframeIndex implements Action {
    readonly type = UPDATE_KEYFRAME_INDEX;
    constructor(readonly index: number) { }
}

export const SPEED_CHANGE = 'SPEED_CHANGE';

export class SpeedChange implements Action {
    readonly type = SPEED_CHANGE;
    constructor(readonly speed: number) { }
}

export const INTERPOLATE_CHANGE = 'INTERPOLATE_CHANGE';

export class InterpolateChange implements Action {
    readonly type = INTERPOLATE_CHANGE;
    constructor(readonly interpolate: number) { }
}

export const PAST_CHANGE = 'PAST_CHANGE';

export class PastChange implements Action {
    readonly type = PAST_CHANGE;
    constructor(readonly val: number) { }
}

export const NEXT_FRAME = 'NEXT_FRAME';

export class NextFrame implements Action {
    readonly type = NEXT_FRAME;
    constructor() { }
}

export const DELETE_ENTITY = 'DELETE_ENTITY';

export class DeleteEntity implements Action {
    readonly type = DELETE_ENTITY;
    constructor(readonly entityId: number) { }
}

export const SELECT_ENTITY = 'SELECT_ENTITY';

export class SelectEntity implements Action {
    readonly type = SELECT_ENTITY;
    constructor(readonly id?: number, readonly keyframe?: number) { }
}

export const CHANGE_ACTION = 'CHANGE_ACTION';

export class ChangeAction implements Action {
    readonly type = CHANGE_ACTION;
    constructor(readonly actionId: number, readonly actionType: EntityActionType) { }
}

export const CHANGE_ACTION_END = 'CHANGE_ACTION_END';

export class ChangeActionEnd implements Action {
    readonly type = CHANGE_ACTION_END;
    constructor(readonly actionId: number, readonly end: number) { }
}
export type ActionTypes = ChangeAction | ChangeActionEnd | AddEntity | AddAction | UpdateKeyframeIndex | SpeedChange | NextFrame | DeleteEntity | SetPosition | InterpolateChange | PastChange | SelectEntity;

export const getDrillsState = createSelector((state: { drillsState: DrillsState }) => state.drillsState, (drillsState: DrillsState) => drillsState);

export const getEntities = createSelector(getDrillsState, (drillsState) => drillsState.entities);

export const getKeyframeIndex = createSelector(getDrillsState,
    (drillsState) => drillsState.keyframeIndex);

export const getActions = createSelector(getDrillsState,
    (drillsState) => drillsState.actions);

export const getInterpolate = createSelector(getDrillsState,
    (drillsState) => drillsState.interpolate);

export const getPast = createSelector(getDrillsState,
    (drillsState) => drillsState.past);

export const getSelectedEntityId = createSelector(getDrillsState, (drillsState) => drillsState.selectedEntityId);

export const getDrawState = createSelector(getEntities, getKeyframeIndex, getInterpolate, getActions, getPast, getSelectedEntityId,
    (entities, keyframeIndex, interpolate, actions, past) => ({ entities, keyframeIndex, interpolate, actions, past }));

export const maxAnimationLength = createSelector(getDrillsState, (drillsState) => Math.max(...drillsState.actions.map((action) => action.animation.endFrame)));

export const currentEntity: MemoizedSelector<{ drillsState: DrillsState }, Entity | undefined> = createSelector(getDrillsState,
    (drillsState) => {
        if (drillsState.selectedEntityId == null) {
            return undefined;
        }
        return drillsState.entities[drillsState.selectedEntityId];
    });

export const getCurrentAction = createSelector(currentEntity, getKeyframeIndex, getActions,
    (entity, keyframeIndex, actions) => {
        if (entity) {
            return actionForKeyframe(entity, actions, keyframeIndex);
        }
        return undefined;
    });

// function totalAnimationLength(entity: Entity): number {
//     return Math.max(...entity.actions.map((action) => action.animation.endFrame));
// }

export function actionForKeyframe(entity: Entity, actions: EntityAction[], keyframeIndex: number): EntityAction | undefined {
    return actions.find((action) =>
        action.animation.startFrame < keyframeIndex && action.animation.endFrame >= keyframeIndex && action.entityIds.has(entity.id));
}

export function percentOfAction(entity: Entity, actions: EntityAction[], keyframe: number): number | null {
    const currentAction = actionForKeyframe(entity, actions, keyframe);
    if (!currentAction) {
        return null;
    }
    return percentOfActionHelper(currentAction, keyframe);
}

export function percentOfActionHelper(action: EntityAction, keyframe: number): number | null {
    if (!action) {
        return null;
    }
    return (action.animation.endFrame - keyframe) / (action.animation.endFrame - action.animation.startFrame);
}

export function startPositionForAction(entity: Entity, actions: EntityAction[], keyframe: number): Position {
    // Sort the actions from start to finish
    const sorted = actions.filter((action) => action.entityIds.has(entity.id)).sort((a, b) => b.animation.endFrame - a.animation.endFrame);
    // Find the most recent action.
    for (const action of sorted) {
        if (action.animation.endFrame <= keyframe) {
            return action.animation.endPos;
        }
    }
    return entity.start;
}

export function positionForKeyFrame(entity: Entity, actions: EntityAction[], keyframe: number): Position | null {
    const lastPosition = startPositionForAction(entity, actions, keyframe);
    const currentAction = actionForKeyframe(entity, actions, keyframe);
    if (!currentAction) {
        // We are not currently in an action, so just return the position of the most recent action.
        return lastPosition;
    }
    // Finally, compute the interpolation and return the keyframe.
    // const length = currentAction.animation.end - currentAction.animation.start;
    const length = currentAction.animation.endFrame - currentAction.animation.startFrame;
    const index = keyframe - currentAction.animation.startFrame;
    return {
        posX: lastPosition.posX + (currentAction.animation.endPos.posX - lastPosition.posX) / length * index,
        posY: lastPosition.posY + (currentAction.animation.endPos.posY - lastPosition.posY) / length * index,
    };
}

let nextEntityId = 0;
let nextActionId = 0;
export function drillsReducer(state: DrillsState = initialState, action: ActionTypes): DrillsState {
    switch (action.type) {
        case ADD_ENTITY: {
            while (state.entities.some((entity) => entity.id === nextEntityId)) {
                nextEntityId++;
            }
            return { ...state, selectedEntityId: state.entities.length, entities: state.entities.concat([{ ...action.entity, id: nextEntityId }]) };
        }
        case SET_POSITION: {
            const keyframe = state.keyframeIndex - action.offset;
            const keyframeEntity = state.entities.find((entity) => entity.id === action.entityId);
            if (!keyframeEntity) {
                return state;
            }
            const keyframeAction = actionForKeyframe(keyframeEntity, state.actions, keyframe);
            if (!keyframeAction) {
                keyframeEntity.start = action.position;
            } else {
                // If this was done at the end of the entity, just move that.
                if (keyframe === keyframeAction.animation.endFrame) {
                    keyframeAction.animation.endPos = action.position;
                } else {
                    // Otherwise, interpolate from the position of the entity at that keyframe to the end.
                    // TODO combine this with for loop above.
                    const percent = 1 - (percentOfActionHelper(keyframeAction, keyframe) || 0);
                    if (!percent) {
                        console.warn('wtf?');
                        return state;
                    }
                    const startPosition = startPositionForAction(keyframeEntity, state.actions, keyframe);
                    const animationLength = keyframeAction.animation.endFrame - keyframeAction.animation.startFrame;
                    const newY = (action.position.posY - startPosition.posY) / percent + startPosition.posY;
                    const newX = (action.position.posX - startPosition.posX) / percent + startPosition.posX;
                    keyframeAction.animation.endPos = { posX: newX, posY: newY };
                }
            }
            return {
                ...state, entities: state.entities.map((entity) => {
                    if (entity.id === action.entityId) {
                        return keyframeEntity;
                    }
                    return entity;
                }),
            };
        }
        case ADD_ACTION: {
            const framesToAdd = state.interpolate === 0 ? 1 : state.interpolate;
            const newAction = {
                type: PlayerActions.MOVE,
                animation: {
                    endPos: action.endPos,
                    startFrame: state.keyframeIndex,
                    endFrame: state.keyframeIndex + framesToAdd,
                },
                actionId: nextActionId++,
                entityIds: new Set([action.entityId]),
            };
            return {
                ...state,
                actions: [...state.actions, newAction],
                keyframeIndex: state.keyframeIndex + framesToAdd,
                interpolate: 1,
                past: framesToAdd,
            };
        }
        case UPDATE_KEYFRAME_INDEX:
            return { ...state, keyframeIndex: action.index };
        case SPEED_CHANGE:
            return { ...state, speed: action.speed };
        case INTERPOLATE_CHANGE:
            return { ...state, interpolate: action.interpolate };
        case PAST_CHANGE:
            return { ...state, past: action.val };
        case NEXT_FRAME:
            const maxLength = maxAnimationLength.projector(state);
            if (maxLength === 0) {
                return state;
            }
            return { ...state, keyframeIndex: (state.keyframeIndex + 1) % (maxLength + 1) };
        case DELETE_ENTITY:
            return { ...state, entities: state.entities.filter((entity) => entity.id !== action.entityId) };
        case SELECT_ENTITY: {
            if (state.selectedEntityId === action.id && action.keyframe === undefined) {
                return state;
            }
            const actionEntity = currentEntity({ drillsState: state });
            if (actionEntity == null) {
                throw new Error('Failed to select entity');
            }
            const currentAction = actionForKeyframe(
                actionEntity, state.actions, state.keyframeIndex - (action.keyframe || 0));
            if (!currentAction) {
                return {
                    ...state,
                    selectedEntityId: action.id,
                };
            }
            return {
                ...state,
                selectedEntityId: action.id,
                past: state.keyframeIndex - currentAction.animation.startFrame,
                interpolate: currentAction.animation.endFrame - state.keyframeIndex
            };
        }
        case CHANGE_ACTION: {
            const currentAction: EntityAction | undefined = state.actions.find((tempAction) => tempAction.actionId === action.actionId);
            if (currentAction == null) {
                throw new Error('Tried to change action when none was selected');
            }
            return {
                ...state, actions: state.actions.map((tempAction) => {
                    if (tempAction.actionId === currentAction.actionId) {
                        return {
                            ...tempAction, type: tempAction.type,
                        };
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
            const currentAction: EntityAction | undefined = state.actions.find((tempAction) => tempAction.actionId === action.actionId);
            console.log(currentAction);
            if (currentAction == null) {
                throw new Error('Tried to change action when none was selected');
            }
            const endDistance = currentAction.animation.endFrame - action.end;
            return {
                ...state, actions: state.actions.map((tempAction) => {
                    if (tempAction.actionId === action.actionId) {
                        // tempAction.animation.start = action.start;
                        tempAction.animation.endFrame = action.end;
                    } else {
                        if (tempAction.animation.startFrame >= currentAction.animation.startFrame) {
                            tempAction.animation.startFrame -= endDistance;
                            tempAction.animation.endFrame -= endDistance;
                        } else {
                            console.log('not current action: ', tempAction.animation.startFrame, currentAction.animation.startFrame);
                        }
                        // else if (tempAction.animation.end < currentAction.animation.end) {
                        //     tempAction.animation.start -= startDistance;
                        //     tempAction.animation.end -= startDistance;
                        // }
                    }
                    // tempAction.animation.start = Math.max(0, tempAction.animation.start);
                    tempAction.animation.endFrame = Math.max(0, tempAction.animation.endFrame);
                    return { ...tempAction };
                }),
                keyframeIndex: currentAction.animation.endFrame,
                past: currentAction.animation.endFrame - currentAction.animation.startFrame,
            };
        }
        default:
            return ((assertUnreachable: never) => state)(action);
    }
}
