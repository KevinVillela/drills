import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {PossessSelected} from './model';
import {
  AbsolutePosition,
  Animation,
  AnimationEnd,
  BallActions,
  Drill,
  DrillsState,
  Entity,
  EntityAction,
  EntityType,
  PlayerActions,
  Position,
  Possession,
  RotationEnd
} from './types';

@Injectable()
export class AnimationService {
  drillsState: DrillsState;
  possessions: Possession[];

  constructor(private readonly store: Store<{drillsState: DrillsState}>) {
    // TODO move selectors into their own file.
    this.store.select(((tmp) => tmp.drillsState)).subscribe((val) => { this.drillsState = val; });
  }

  positionForKeyframe(entity: Entity, keyframe: number) {
    return positionForKeyframeHelper(entity, keyframe, this.drillsState);
  }
}
/* TODO move to a selector */
export function getPossessions(drillsState: DrillsState): Possession[] {
  const animation = drillsState.animations[0];
  const possessions: Possession[] = [];
  for (const action of animation.actions) {
    // Add a new possession for this action, if necessary.
    if (action.end.type === 'ENTITY') {
      const entity = entityWithIdOrDie(animation.entities, action.targetId);
      if (action.startFrame === 0) {
        possessions.push({
          playerId : entity.type === EntityType.PLAYER ? entity.id : action.end.entityId,
          ballId : entity.type !== EntityType.PLAYER ? entity.id : action.end.entityId,
          determinantId : action.end.entityId,
          startFrame : action.endFrame,
        });
      } else {
        possessions.push({
          playerId : entity.type === EntityType.PLAYER ? entity.id : action.end.entityId,
          ballId : entity.type !== EntityType.PLAYER ? entity.id : action.end.entityId,
          determinantId : action.end.entityId,
          startFrame : action.endFrame,
        });
      }
    }
  }
  for (const action of animation.actions) {
    for (const possession of possessions) {
      // Set the end frame of the previous possession, if it exists.
      if (hasPossessionAtKeyframe(action.startFrame, possession) &&
          (possession.playerId === action.targetId || possession.ballId === action.targetId)) {
        if (Object.values(BallActions).includes(action.type)) {
          possession.endFrame = action.startFrame;
        }
      }
    }
  }
  return possessions;
}

/**
 * Find the position for the given entity at the given keyframe.
 * 1. Find the last action position.
 * 2. Find the next action position.
 * 3. Interpolate between them.
 */
export function positionForKeyframeHelper(entity: Entity, keyframe: number,
                                          drillsState: DrillsState): AbsolutePosition {
  const possessions = getPossessions(drillsState);
  const animation = drillsState.animations[0];
  // If we are CURRENTLY in possession, then just get the position of the possessing entity, which
  // must be a player.
  for (const tempPossession of possessions) {
    if (!hasPossessionAtKeyframe(keyframe, tempPossession)) {
      continue;
    }
    if (tempPossession.ballId !== entity.id ||
        (tempPossession.determinantId === entity.id && tempPossession.startFrame === keyframe)) {
      continue;
    }
    /* This Entity is the possessee, so find the position of the possessor. */
    const player = entityWithIdOrDie(animation.entities, tempPossession.playerId);
    return positionForKeyframeHelper(player, keyframe, drillsState);
    // Otherwise, we are just a player that is in possession of a ball, so continue to get the
    // position as normal.
  }
  const currentAction = actionForKeyframe(entity, animation.actions, keyframe);
  // 1. Get start position.
  const lastPosition = startPositionForAction(entity, keyframe, possessions, drillsState);
  // 2. Get end Position.
  let actionEndPosition: AbsolutePosition|null = null;
  if (!currentAction) {
    // We are not currently in an action, check if we are possessed and return that position if so.

    // Otherwise, return the start position.
    return {...lastPosition, posZ : getPosZ(entity, keyframe, drillsState)};
  }
  // Still getting the end position
  actionEndPosition = endPositionForAction(entity, currentAction, keyframe, drillsState);
  if (!actionEndPosition) {
    throw new Error('Unable to get end position for action');
  }

  // Finally, compute the interpolation and return the keyframe.
  // const nextAction = getNextAction(entity, keyframe, drillsState);
  const length = currentAction.endFrame - currentAction.startFrame;
  const index = keyframe - currentAction.startFrame;

  let rotation = 0;
  const rotationDelta = (actionEndPosition.rotation - lastPosition.rotation);
  if (rotationDelta > 180) {
    rotation = lastPosition.rotation - (360 - rotationDelta) / length * index;
  } else {
    rotation = lastPosition.rotation + rotationDelta / length * index;
  }
  if (rotation < 0) {
    rotation = 360 + rotation;
  }
  rotation = rotation % 360;
  return {
    posX : lastPosition.posX + (actionEndPosition.posX - lastPosition.posX) / length * index,
    posY : lastPosition.posY + (actionEndPosition.posY - lastPosition.posY) / length * index,
    posZ : getPosZ(entity, keyframe, drillsState),
    rotation,
  };
}

const SCALE = 1.5;
const JUMP_TIME = 6;
function getPosZ(entity: Entity, keyframe: number, drillsState: DrillsState): number {
  const animation = drillsState.animations[0];
  let posZ = 1;
  const currentAction = actionForKeyframe(entity, animation.actions, keyframe);
  if (currentAction && currentAction.jumping) {
    const timeToNext = currentAction.endFrame - keyframe;
    if (timeToNext <= JUMP_TIME) {
      posZ = JUMP_TIME + 1 - timeToNext;
    }
  }
  if (posZ === 1) {
    const lastAction = getLastAction(entity, keyframe, drillsState);
    if (lastAction && lastAction.jumping) {
      const timeSinceLast = keyframe - lastAction.endFrame;
      if (timeSinceLast <= JUMP_TIME) {
        posZ = JUMP_TIME + 1 - timeSinceLast;
      }
    }
  }
  return Math.max(1, posZ / SCALE);
}

export function getLastAction(entity: Entity, keyframe: number,
                              drillsState: DrillsState): EntityAction|undefined {
  const animation = drillsState.animations[0];
  // Sort the actions from start to finish. TODO is that true?
  const sorted = animation.actions.filter(action => action.targetId === entity.id)
                     .sort((a, b) => b.endFrame - a.endFrame);
  for (const action of sorted) {
    if (action.endFrame < keyframe) {
      return action;
    }
  }
  return undefined;
}

export function startPositionForAction(entity: Entity, keyframe: number, possessions: Possession[],
                                       drillsState: DrillsState): AbsolutePosition {
  const animation = drillsState.animations[0];
  // Sort the actions from start to finish. TODO is that true?
  const sorted = animation.actions.filter(action => action.targetId === entity.id)
                     .sort((a, b) => b.endFrame - a.endFrame);
  // Find the most recent action.
  let lastKeyframe: number|null = null;
  for (const action of sorted) {
    // Make sure it is less-than instead of less-than-or-equal-to so we don't get the current
    // action.
    if (action.endFrame < keyframe) {
      // Because of possessions, there is a difference between the position of the entity at the end
      // of the last action and the position of the entity at the start of the current action. We
      // have to get the latter.
      const currentAction = actionForKeyframe(entity, animation.actions, keyframe);
      // const test = currentAction ? currentAction.startFrame : keyframe;
      let test: number|null = null;
      if (action.end.type === 'POSITION') {
        test = action.endFrame;
      } else {
        test = action.endFrame;
        // If the entity was in possession at this frame, find it's position when it is freed.
        for (const possession of possessions) {
          if (!hasPossessionAtKeyframe(test, possession)) {
            continue;
          }
          if (possession.ballId !== entity.id && possession.playerId !== entity.id) {
            continue;
          }
          if (possession.determinantId === entity.id) {
            continue;
          }
          if (possession.endFrame === undefined) {
            continue;
            // throw new Error(`Found impossible possession`);
          }
          test = possession.endFrame;
          break;
        }
      }
      return {
        ...resolvePosition(action.end, entity, test, possessions, drillsState),
        rotation : action.rotation.degrees,
        posZ : getPosZ(entity, keyframe, drillsState),
      };
    }
    lastKeyframe = action.startFrame;
  }
  // TODO move this into the for loop
  const tmp = sorted[sorted.length - 1];
  return {
    ...resolvePosition(tmp.end, entity, keyframe, possessions, drillsState),
    rotation : tmp.rotation.degrees,
    posZ : getPosZ(entity, keyframe, drillsState),
  };
}

function resolvePosition(pos: AnimationEnd, entity: Entity, keyframe: number,
                         possessions: Possession[], drillsState: DrillsState): Position {
  const animation = drillsState.animations[0];
  if (pos.type === 'POSITION') {
    return pos.endPos;
  } else {
    const player = entityWithId(animation.entities, pos.entityId);
    if (!player) {
      throw new Error(`Possession by unknown player with ID ${pos.entityId}`);
    }
    return positionForKeyframeHelper(player, keyframe, drillsState);
  }
}

export function endPositionForAction(entity: Entity, action: EntityAction, keyframe: number,
                                     drillsState: DrillsState): AbsolutePosition {
  const animation = drillsState.animations[0];
  if (action.end.type === 'POSITION') {
    return {
      ...action.end.endPos,
      rotation : action.rotation.degrees,
      posZ : getPosZ(entity, keyframe, drillsState)
    };
  } else {
    const possessor = entityWithId(animation.entities, action.end.entityId);
    if (!possessor) {
      throw new Error('Unknown entity with ID ' + action.end.entityId);
    }
    return {
      ...positionForKeyframeHelper(possessor, action.endFrame, drillsState),
      rotation : action.rotation.degrees
    };
  }
}

export function lastActionForKeyframe(entity: Entity, actions: EntityAction[],
                                      keyframeIndex: number): EntityAction {
  const test =
      actions.filter(action => action.targetId === entity.id && action.startFrame <= keyframeIndex)
          .sort((action1, action2) => action1.startFrame - action2.startFrame);
  return test[test.length - 1];
}

export function actionForKeyframe(entity: Entity, actions: EntityAction[],
                                  keyframeIndex: number): EntityAction|undefined {
  const test = actions.find(action => {
    return action.startFrame <= keyframeIndex && action.endFrame >= keyframeIndex &&
           action.targetId === entity.id;
  });
  return test;
}

export function hasPossessionAtKeyframe(keyframe: number, possession: Possession) {
  return possession.startFrame <= keyframe &&
         (possession.endFrame === undefined || possession.endFrame >= keyframe);
}

export function losesPossession(action: EntityAction) {
  return Object.keys(BallActions).includes(action.type);
}

export function entityWithId(entities: Entity[], id: number) {
  return entities.find((entity) => entity.id === id);
}

export function entityWithIdOrDie(entities: Entity[], id: number) {
  const ret = entityWithId(entities, id);
  if (!ret) {
    throw new Error(`Could not find entity with ID ${id}`);
  }
  return ret;
}
