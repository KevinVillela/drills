import { Action, createSelector } from '@ngrx/store';
import { InitialState } from '@ngrx/store/src/models';
import { last } from 'rxjs/operators';

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

export interface EntityAction {
    type: BallActions | PlayerActions;
    animation: {
        endPos: Position;
        /** The starting keyframe, inclusive. */
        start: number;
        /** The ending keyframe, exclusive. */
        end: number;
    }
}

export interface DrillsState {
    entities: Entity[];
    /** The currently selected entity, if any. */
    entityIndex?: number;
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
    type: EntityType;
    icon: string;
    // Actions do not have to be in order.
    actions: EntityAction[];
    start: Position;
}

export const initialState: DrillsState = JSON.parse(`{"entities":[{"icon": "volleyball", "start":{"posX":305,"posY":46},"actions":[{"type":"spike","animation":{"endPos":{"posX":107,"posY":273},"start":0,"end":15}},{"type":"bump","animation":{"endPos":{"posX":200,"posY":198},"start":15,"end":37}},{"type":"set","animation":{"endPos":{"posX":131,"posY":55},"start":37,"end":59}},{"type":"set","animation":{"endPos":{"posX":301,"posY":57},"start":59,"end":95}}],"type":"player_yellow"},{"start":{"posX":302,"posY":28},"actions":[],"type":"player","icon": "player_white"},{"start":{"posX":105,"posY":286},"actions":[{"type":"move","animation":{"endPos":{"posX":125,"posY":56},"start":20,"end":60}},{"type":"move","animation":{"endPos":{"posX":53,"posY":352},"start":60,"end":85}},{"type":"move","animation":{"endPos":{"posX":381,"posY":374},"start":85,"end":100}}],"type":"player","icon": "player_blue"},{"start":{"posX":289,"posY":285},"actions":[{"type":"move","animation":{"endPos":{"posX":216,"posY":210},"start":12,"end":38}},{"type":"move","animation":{"endPos":{"posX":109,"posY":279},"start":45,"end":66}}],"type":"player","icon": "player_green"},{"start":{"posX":383,"posY":372},"actions":[{"type":"move","animation":{"endPos":{"posX":285,"posY":285},"start":35,"end":58}}],"type":"player","icon": "player_yellow"}],"keyframeIndex":26,"speed":30,"interpolate":0,"past":0,"entityIndex":0}`)
// {
//     entities: [],
//     keyframeIndex: 0,
//     speed: 100,
//     interpolate: 0,
//     past: 3,
// };

export const ADD_ENTITY = 'ADD_ENTITY';

export class AddEntity implements Action {
    readonly type = ADD_ENTITY;
    constructor(readonly entity: Entity) { }
}

export const ADD_ACTION = 'ADD_ACTION';

export class AddAction implements Action {
    readonly type = ADD_ACTION;
    constructor(readonly index: number, readonly endPos: Position) { };
}

export const SET_POSITION = 'SET_POSITION';

export class SetPosition implements Action {
    readonly type = SET_POSITION;
    constructor(readonly index: number, readonly position: Position) { };
}

export const UPDATE_KEYFRAME_INDEX = 'UPDATE_KEYFRAME_INDEX';

export class UpdateKeyframeIndex implements Action {
    readonly type = UPDATE_KEYFRAME_INDEX;
    constructor(readonly index: number) { };
}

export const SPEED_CHANGE = 'SPEED_CHANGE';

export class SpeedChange implements Action {
    readonly type = SPEED_CHANGE;
    constructor(readonly speed: number) { };
}

export const INTERPOLATE_CHANGE = 'INTERPOLATE_CHANGE';

export class InterpolateChange implements Action {
    readonly type = INTERPOLATE_CHANGE;
    constructor(readonly interpolate: number) { };
}

export const PAST_CHANGE = 'PAST_CHANGE';

export class PastChange implements Action {
    readonly type = PAST_CHANGE;
    constructor(readonly val: number) { };
}

export const NEXT_FRAME = 'NEXT_FRAME';

export class NextFrame implements Action {
    readonly type = NEXT_FRAME;
    constructor() { };
}

export const DELETE_ENTITY = 'DELETE_ENTITY';

export class DeleteEntity implements Action {
    readonly type = DELETE_ENTITY;
    constructor(readonly index: number) { }
}

export const SELECT_ENTITY = 'SELECT_ENTITY';

export class SelectEntity implements Action {
    readonly type = SELECT_ENTITY;
    constructor(readonly index: number) { }
}

export const CHANGE_ACTION = 'CHANGE_ACTION';

export class ChangeAction implements Action {
    readonly type = CHANGE_ACTION;
    constructor(readonly actionType: EntityActionType) { }
}

export const CHANGE_ACTION_TIME = 'CHANGE_ACTION_TIME';

export class ChangeActionLength implements Action {
    readonly type = CHANGE_ACTION_TIME;
    constructor(readonly start: number, readonly end: number) { }
}
export type ActionTypes = ChangeAction | ChangeActionLength | AddEntity | AddAction | UpdateKeyframeIndex | SpeedChange | NextFrame | DeleteEntity | SetPosition | InterpolateChange | PastChange | SelectEntity;

export const getDrillsState = createSelector((state: { drillsState: DrillsState }) => state.drillsState, (drillsState: DrillsState) => drillsState);

export const maxAnimationLength = createSelector(getDrillsState, (drillsState) => Math.max(...drillsState.entities.map((entity) => {
    return totalAnimationLength(entity);
})));

export const currentEntity = createSelector(getDrillsState,
    (drillsState) => drillsState.entities[drillsState.entityIndex]);
export const keyframeIndex = createSelector(getDrillsState,
    (drillsState) => drillsState.keyframeIndex);

export const getCurrentAction = createSelector(currentEntity, keyframeIndex,
    (entity, keyframeIndex) => {
        if (entity) {
            return actionForKeyframe(entity, keyframeIndex);
        }
        return null;
    });

export function totalAnimationLength(entity: Entity): number {
    return Math.max(...entity.actions.map((action) => action.animation.end));
}

export function actionForKeyframe(entity: Entity, keyframe: number): EntityAction | null {
    return entity.actions.find((action) => keyframe >= action.animation.start && keyframe <= action.animation.end);
}

export function percentOfAction(entity: Entity, keyframe: number): number | null {
    const currentAction = actionForKeyframe(entity, keyframe);
    if (!currentAction) {
        return null;
    }
    return (currentAction.animation.end - keyframe) / (currentAction.animation.end - currentAction.animation.start);
}

export function positionForKeyFrame(entity: Entity, keyframe: number): Position | null {
    let lastPosition = entity.start;
    // Sort the actions from start to finish
    const sorted = entity.actions.sort((a, b) => a.animation.end - b.animation.end);
    const currentAction = actionForKeyframe(entity, keyframe);
    // Find the most recent action.
    for (const action of sorted) {
        if (action.animation.end > keyframe) {
            break;
        }
        lastPosition = action.animation.endPos;
    }
    if (!currentAction) {
        // We are not currently in an action, so just return the position of the most recent action.
        return lastPosition;
    }
    // Finally, compute the interpolation and return the keyframe.
    // const length = currentAction.animation.end - currentAction.animation.start;
    const length = currentAction.animation.end - currentAction.animation.start;
    const index = keyframe - currentAction.animation.start;
    return {
        posX: lastPosition.posX + (currentAction.animation.endPos.posX - lastPosition.posX) / length * index,
        posY: lastPosition.posY + (currentAction.animation.endPos.posY - lastPosition.posY) / length * index,
    };
}

export function drillsReducer(state: DrillsState = initialState, action: ActionTypes): DrillsState {
    switch (action.type) {
        case ADD_ENTITY:
            // if (totalAnimationLength(action.entity) < maxAnimationLength.projector(state)) {
            //     fillAnimation(action.entity, maxAnimationLength.projector(state));
            // }
            return { ...state, entityIndex: state.entities.length, entities: state.entities.concat(action.entity) };
        case SET_POSITION: {
            return state;
            // const keyframeEntity = state.entities[action.index];
            // const keyframeAction = actionForKeyframe(keyframeEntity, state.keyframeIndex);
            // keyframeAction.animation.endPos = action.position;
            // return {
            //     ...state, entities: state.entities.map((entity, index) => {
            //         if (index === action.index) {
            //             return keyframeEntity;
            //         }
            //         return entity;
            //     }),
            // };
        }
        case ADD_ACTION: {
            const newEntity = state.entities[action.index];
            if (state.interpolate === 0) {
                // We aren't actually adding an action, just moving it.
                // Note that we can only move the end of actions.
                const currentAction = actionForKeyframe(newEntity, state.keyframeIndex);
                if (currentAction) {
                    currentAction.animation.endPos = action.endPos;
                } else {
                    newEntity.start = action.endPos;
                }
            } else {
                newEntity.actions.push({
                    type: PlayerActions.MOVE,
                    animation: { endPos: action.endPos, start: state.keyframeIndex, end: state.keyframeIndex + state.interpolate }
                });
            }
            return {
                ...state, entities: state.entities.map((entity, index) => {
                    if (index === action.index) {
                        return newEntity;
                    }
                    return entity;
                }),
                keyframeIndex: state.keyframeIndex + state.interpolate,
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
            return { ...state, keyframeIndex: (state.keyframeIndex + 1) % (maxAnimationLength.projector(state) + 1) };
        case DELETE_ENTITY:
            return { ...state, entities: state.entities.filter((entity, idx) => idx !== action.index) };
        case SELECT_ENTITY:
            return { ...state, entityIndex: action.index };
        case CHANGE_ACTION: {
            const actionEntity = currentEntity.projector(state);
            const currentAction = getCurrentAction.projector(actionEntity, state.keyframeIndex);
            return {
                ...state, entities: state.entities.map((entity) => {
                    if (entity === actionEntity) {
                        return {
                            ...entity, actions: entity.actions.map((tempAction) => {
                                if (tempAction === currentAction) {
                                    return { ...tempAction, type: action.actionType };
                                }
                                return tempAction;
                            })
                        }
                    }
                    return entity;
                })
            };
        }
        case CHANGE_ACTION_TIME: {
            const actionEntity = state.entities[state.entityIndex];
            const currentAction: EntityAction = getCurrentAction.projector(actionEntity, state.keyframeIndex);
            const endDistance = currentAction.animation.end - action.end;
            const startDistance = currentAction.animation.start - action.start;
            return {
                ...state, entities: state.entities.map((entity) => {
                    if (entity === actionEntity) {
                        return {
                            ...entity, actions: entity.actions.map((tempAction) => {
                                if (tempAction === currentAction) {
                                    tempAction.animation.start = action.start;
                                    tempAction.animation.end = action.end;
                                } else {
                                    if (tempAction.animation.start > currentAction.animation.start) {
                                        tempAction.animation.start -= endDistance;
                                        tempAction.animation.end -= endDistance;
                                    } else if (tempAction.animation.end < currentAction.animation.end) {
                                        tempAction.animation.start -= startDistance;
                                        tempAction.animation.end -= startDistance;
                                    }
                                }
                                tempAction.animation.start = Math.max(0, tempAction.animation.start);
                                tempAction.animation.end = Math.max(0, tempAction.animation.end);
                                return { ...tempAction };
                            })
                        }
                    }
                    return entity;
                })
            };
        }
        default:
            return ((assertUnreachable: never) => state)(action);
    }
}