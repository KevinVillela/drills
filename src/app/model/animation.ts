import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {
  Animation,
  AnimationEnd,
  BallActions,
  DrillsState,
  Entity,
  EntityAction,
  EntityType,
  PlayerActions,
  Position,
  Possession
} from './types';

@Injectable()
export class AnimationService {
  drillsState: DrillsState;

  constructor(private readonly store: Store<{drillsState: DrillsState}>) {
    // TODO move selectors into their own file.
    this.store.select(((tmp) => tmp.drillsState)).subscribe((val) => { this.drillsState = val; });
  }

  positionForKeyframe(entity: Entity, keyframe: number) {
    return positionForKeyframeHelper(entity, keyframe, this.drillsState);
  }
}

/**
 * Find the position for the given entity at the given keyframe.
 * 1. Find the last action position.
 * 2. Find the next action position.
 * 3. Interpolate between them.
 */
export function positionForKeyframeHelper(entity: Entity, keyframe: number,
                                          drillsState: DrillsState) {
  const animation = drillsState.animations[0];
  // If we are CURRENTLY in possession, then just get the position of the possessing entity, which
  // must be a player.
  for (const tempPossession of animation.possessions) {
    if (!hasPossessionAtKeyframe(keyframe, tempPossession)) {
      continue;
    }
    if (tempPossession.ballId === entity.id) {
      const player = entityWithId(animation.entities, tempPossession.playerId);
      if (!player) {
        throw new Error(`Possession by unknown player with ID ${tempPossession.playerId}`);
      }
      return positionForKeyframeHelper(player, keyframe, drillsState);
    }
    // Otherwise, we are just a player that is in possession of a ball, so continue to get the
    // position as normal.
  }
  // 1. Get start position.
  const lastPosition = startPositionForAction(entity, keyframe, drillsState);
  // 2. Get end Position.
  let actionEndPosition: Position|null = null;
  const currentAction = actionForKeyframe(entity, animation.actions, keyframe);
  if (!currentAction) {
    // We are not currently in an action, check if we are possessed and return that position if so.

    // Otherwise, return the start position.
    return lastPosition;
  }
  // Still getting the end position
  actionEndPosition = endPositionForAction(currentAction, keyframe, drillsState);
  if (!actionEndPosition) {
    throw new Error('Unable to get end position for action');
  }

  // Finally, compute the interpolation and return the keyframe.
  // const length = currentaction.end - currentaction.start;
  const length = currentAction.endFrame - currentAction.startFrame;
  const index = keyframe - currentAction.startFrame;

  return {
    posX : lastPosition.posX + (actionEndPosition.posX - lastPosition.posX) / length * index,
    posY : lastPosition.posY + (actionEndPosition.posY - lastPosition.posY) / length * index
  };
}

export function startPositionForAction(entity: Entity, keyframe: number,
                                       drillsState: DrillsState): Position {
  const animation = drillsState.animations[0];
  // Sort the actions from start to finish
  const sorted = animation.actions.filter(action => action.entityIds.includes(entity.id))
                     .sort((a, b) => b.endFrame - a.endFrame);
  // Find the most recent action.
  for (const action of sorted) {
    // Make sure it is less-than instead of less-than-or-equal-to so we don't get the current
    // action.
    if (action.endFrame < keyframe) {
      return resolvePosition(action.end, entity, keyframe, drillsState);
    }
  }
  return resolvePosition(entity.start, entity, keyframe, drillsState);
}

function resolvePosition(pos: AnimationEnd, entity: Entity, keyframe: number,
                         drillsState: DrillsState): Position {
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

export function endPositionForAction(action: EntityAction, keyframe: number,
                                     drillsState: DrillsState): Position {
  const animation = drillsState.animations[0];
  if (action.end.type === 'POSITION') {
    return action.end.endPos;
  } else {
    const entity = entityWithId(animation.entities, action.end.entityId);
    if (!entity) {
      throw new Error('Unknown entity with ID ' + action.end.entityId);
    }
    return positionForKeyframeHelper(entity, action.endFrame, drillsState);
  }
}
// export function endPositionForAction(
//   entity: Entity, keyframe: number, drillsState: DrillsState): Position {
// const animation = drillsState.animations[0];
// // Sort the actions from finish to start
// const sorted = animation.actions.filter(action => action.entityIds.includes(entity.id))
//                    .sort((a, b) => b.endFrame - a.endFrame);
// for (const action of sorted) {
//   if (action.endFrame >= keyframe) {
//     if (action.end.type === 'POSITION') {
//       return action.end.endPos;
//     } else {
//       return positionForKeyframeHelper(
//           animation.entities[action.end.entityId], action.endFrame, drillsState);
//     }
//   }
// }
// return entity.start;
// }

export function actionForKeyframe(entity: Entity, actions: EntityAction[],
                                  keyframeIndex: number): EntityAction|undefined {
  return actions.find(action => action.startFrame < keyframeIndex &&
                                action.endFrame >= keyframeIndex &&
                                action.entityIds.includes(entity.id));
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
