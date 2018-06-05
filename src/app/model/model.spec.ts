import {AnimationService, positionForKeyframeHelper} from './animation';
import {initialState} from './model';
import {BallActions, DrillsState, Entity, EntityType, PlayerActions} from './types';

// import { drillsReducer, initialState, AddPosition, Position, DrillsState, EntityType } from
// './model';

fdescribe('animations', () => {
  it('should return start position for no actions', () => {
    const player: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_blue',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        actions : [ {
          id : 1000,
          targetId : player.id,
          type : PlayerActions.MOVE,
          startFrame : 0,
          endFrame : 1,
          end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          rotation: {type: 'POSITION', degrees: 100},
        } ]
      } ]
    };
    expect(positionForKeyframeHelper(player, 1, state)).toEqual({posX : 1, posY : 1, rotation: 100});
    expect(positionForKeyframeHelper(player, 100, state)).toEqual({posX : 1, posY : 1, rotation: 100});
  });

  it('should return position for one action', () => {
    const player: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_blue',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        actions : [
          {
            id : 1000,
            targetId : player.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
            rotation: {type: 'POSITION', degrees: 0},
          },
          {
            id : 1001,
            targetId : player.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
            rotation: {type: 'POSITION', degrees: 200},
          }
        ],
      } ],
    };
    expect(positionForKeyframeHelper(player, 0, state)).toEqual({posX : 1, posY : 1, rotation: 0});
    expect(positionForKeyframeHelper(player, 1, state)).toEqual({posX : 1, posY : 1, rotation: 0});
    expect(positionForKeyframeHelper(player, 2, state)).toEqual({posX : 2, posY : 2, rotation: 50});
    expect(positionForKeyframeHelper(player, 3, state)).toEqual({posX : 3, posY : 3, rotation: 100});
    expect(positionForKeyframeHelper(player, 4, state)).toEqual({posX : 4, posY : 4, rotation: 150});
    expect(positionForKeyframeHelper(player, 5, state)).toEqual({posX : 5, posY : 5, rotation: 200});
    expect(positionForKeyframeHelper(player, 100, state)).toEqual({posX : 5, posY : 5, rotation: 200});
  });

  it('should return position for second action', () => {
    const player: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_blue',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        actions : [
          {
            id : 1000,
            targetId : player.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
            rotation: {type: 'POSITION', degrees: 0},
          },
          {
            id : 1001,
            targetId : 1,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
            rotation: {type: 'POSITION', degrees: 200},
          },
          {
            id : 1002,
            targetId : 1,
            type : PlayerActions.MOVE,
            startFrame : 5,
            endFrame : 10,
            end : {type : 'POSITION', endPos : {posX : 10, posY : 10}},
            rotation: {type: 'POSITION', degrees: 300},
          }
        ],
      } ],
    };
    expect(positionForKeyframeHelper(player, 1, state)).toEqual({posX : 1, posY : 1, rotation: 0});
    expect(positionForKeyframeHelper(player, 2, state)).toEqual({posX : 2, posY : 2, rotation: 50});
    expect(positionForKeyframeHelper(player, 3, state)).toEqual({posX : 3, posY : 3, rotation: 100});
    expect(positionForKeyframeHelper(player, 4, state)).toEqual({posX : 4, posY : 4, rotation: 150});
    expect(positionForKeyframeHelper(player, 5, state)).toEqual({posX : 5, posY : 5, rotation: 200});
    expect(positionForKeyframeHelper(player, 6, state)).toEqual({posX : 6, posY : 6, rotation: 220});
    expect(positionForKeyframeHelper(player, 7, state)).toEqual({posX : 7, posY : 7, rotation: 240});
    expect(positionForKeyframeHelper(player, 8, state)).toEqual({posX : 8, posY : 8, rotation: 260});
    expect(positionForKeyframeHelper(player, 9, state)).toEqual({posX : 9, posY : 9, rotation: 280});
    expect(positionForKeyframeHelper(player, 10, state)).toEqual({posX : 10, posY : 10, rotation: 300});
    expect(positionForKeyframeHelper(player, 100, state)).toEqual({posX : 10, posY : 10, rotation: 300});
  });

  it('should return position for ball that starts in possession of player', () => {
    const player: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_blue',
    };
    const volleyball: Entity = {
      id : 2,
      type : EntityType.VOLLEYBALL,
      icon : 'volleyball',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        entities : [ player, volleyball ],
        actions : [ {
          id : 1000,
          targetId : player.id,
          type : PlayerActions.MOVE,
          startFrame : 0,
          endFrame : 1,
          end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          rotation: {type: 'POSITION', degrees: 100},
        }, {
          id : 1001,
          targetId : volleyball.id,
          type : BallActions.TOSS,
          startFrame : 0,
          endFrame : 1,
          end : {type : 'ENTITY', entityId : 1},
          rotation: {type: 'POSITION', degrees: 100},
        }, {
          id : 1001,
          targetId : 1,
          type : PlayerActions.MOVE,
          startFrame : 1,
          endFrame : 5,
          end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          rotation: {type: 'POSITION', degrees: 100},
        } ],
      } ],
    };
    for (const entity of [player, volleyball]) {
      expect(positionForKeyframeHelper(entity, 0, state)).toEqual({posX : 1, posY : 1, rotation: 100});
      expect(positionForKeyframeHelper(entity, 1, state)).toEqual({posX : 1, posY : 1, rotation: 100});
      expect(positionForKeyframeHelper(entity, 2, state)).toEqual({posX : 2, posY : 2, rotation: 100});
      expect(positionForKeyframeHelper(entity, 3, state)).toEqual({posX : 3, posY : 3, rotation: 100});
      expect(positionForKeyframeHelper(entity, 4, state)).toEqual({posX : 4, posY : 4, rotation: 100});
      expect(positionForKeyframeHelper(entity, 5, state)).toEqual({posX : 5, posY : 5, rotation: 100});
      expect(positionForKeyframeHelper(entity, 100, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    }
  });

  it('should return position for one action with possession', () => {
    // This should simulate a ball being passed to a player
    const player: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_blue',
    };
    const volleyball: Entity = {
      id : 2,
      type : EntityType.VOLLEYBALL,
      icon : 'volleyball',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        entities : [ player, volleyball ],
        actions : [
          {
            id : 1000,
            targetId : player.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
            rotation: {type: 'POSITION', degrees: 100},
          }, {
            id : 1001,
            targetId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
            rotation: {type: 'POSITION', degrees: 100},
          }, {
            id : 1002,
            targetId : 2,
            type : BallActions.SPIKE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : 1},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1003,
            targetId : 1,
            type : PlayerActions.MOVE,
            startFrame : 5,
            endFrame : 10,
            end : {type : 'POSITION', endPos : {posX : 10, posY : 10}},
            rotation: {type: 'POSITION', degrees: 100},
        }
        ],
      } ],
    };
    // First, the ball is hit at the player
    expect(positionForKeyframeHelper(volleyball, 1, state)).toEqual({posX : 1, posY : 1, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 2, state)).toEqual({posX : 2, posY : 2, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 3, state)).toEqual({posX : 3, posY : 3, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 4, state)).toEqual({posX : 4, posY : 4, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 5, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    // The player now has possession of the ball, and will start moving with it.
    for (const entity of [player, volleyball]) {
      expect(positionForKeyframeHelper(entity, 6, state)).toEqual({posX : 6, posY : 6, rotation: 100});
      expect(positionForKeyframeHelper(entity, 7, state)).toEqual({posX : 7, posY : 7, rotation: 100});
      expect(positionForKeyframeHelper(entity, 8, state)).toEqual({posX : 8, posY : 8, rotation: 100});
      expect(positionForKeyframeHelper(entity, 9, state)).toEqual({posX : 9, posY : 9, rotation: 100});
      expect(positionForKeyframeHelper(entity, 10, state)).toEqual({posX : 10, posY : 10, rotation: 100});
      expect(positionForKeyframeHelper(entity, 100, state)).toEqual({posX : 10, posY : 10, rotation: 100});
    }
  });

  it('should return position for two actions with possession', () => {
    // This should simulate a ball being passed to a player and back
    const player1: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_white',
    };
    const player2: Entity = {
      id : 3,
      type : EntityType.PLAYER,
      icon : 'player_blue',
    };
    const volleyball: Entity = {
      id : 2,
      type : EntityType.VOLLEYBALL,
      icon : 'volleyball',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        entities : [ player1, player2, volleyball ],
        actions : [
          {
            id : 1000,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1001,
            targetId : player2.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1002,
            targetId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'ENTITY', entityId : 1},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1003,
            targetId : 2,
            type : BallActions.SPIKE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : 3},
            rotation: {type: 'POSITION', degrees: 100},
        },
          {
            id : 1004,
            targetId : 2,
            type : BallActions.SPIKE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'ENTITY', entityId : 1},
            rotation: {type: 'POSITION', degrees: 100},
        }
        ],
      } ],
    };
    // First, the ball is hit at the second player
    expect(positionForKeyframeHelper(volleyball, 1, state)).toEqual({posX : 1, posY : 1, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 2, state)).toEqual({posX : 2, posY : 2, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 3, state)).toEqual({posX : 3, posY : 3, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 4, state)).toEqual({posX : 4, posY : 4, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 5, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    // Then, the ball is hit back at the first player
    expect(positionForKeyframeHelper(volleyball, 6, state)).toEqual({posX : 4, posY : 4, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 7, state)).toEqual({posX : 3, posY : 3, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 8, state)).toEqual({posX : 2, posY : 2, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 9, state)).toEqual({posX : 1, posY : 1, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 10, state)).toEqual({posX : 1, posY : 1, rotation: 100});
  });

  it('should return position for entity after action', () => {
    // This should simulate a player going to a ball and spiking it.
    const player1: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_white',
    };
    const volleyball: Entity = {
      id : 2,
      type : EntityType.VOLLEYBALL,
      icon : 'volleyball',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        entities : [ player1, volleyball ],
        actions : [
          {
            id : 1000,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1001,
            targetId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1002,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : volleyball.id},
            rotation: {type: 'POSITION', degrees: 100},
        },
          {
            id : 1003,
            targetId : volleyball.id,
            type : BallActions.SPIKE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'POSITION', endPos : {posX : 9, posY : 9}},
            rotation: {type: 'POSITION', degrees: 100},
          }
        ],
      } ],
    };
    // First, the player moves to the ball
    expect(positionForKeyframeHelper(player1, 1, state)).toEqual({posX : 1, posY : 1, rotation: 100});
    expect(positionForKeyframeHelper(player1, 2, state)).toEqual({posX : 2, posY : 2, rotation: 100});
    expect(positionForKeyframeHelper(player1, 3, state)).toEqual({posX : 3, posY : 3, rotation: 100});
    expect(positionForKeyframeHelper(player1, 4, state)).toEqual({posX : 4, posY : 4, rotation: 100});
    expect(positionForKeyframeHelper(player1, 5, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    // Then, he hits the ball. The player should stay in the same spot.
    expect(positionForKeyframeHelper(player1, 6, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    expect(positionForKeyframeHelper(player1, 7, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    expect(positionForKeyframeHelper(player1, 8, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    expect(positionForKeyframeHelper(player1, 9, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    expect(positionForKeyframeHelper(player1, 10, state)).toEqual({posX : 5, posY : 5, rotation: 100});
  });

  it('should return position for picking up and moving with ball', () => {
    // This should simulate a player going to a ball and moving with it.
    const player1: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_white',
    };
    const volleyball: Entity = {
      id : 2,
      type : EntityType.VOLLEYBALL,
      icon : 'volleyball',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        entities : [ player1, volleyball ],
        actions : [
          {
            id : 1000,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1001,
            targetId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
            rotation: {type: 'POSITION', degrees: 100},
        },
          {
            id : 1002,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : volleyball.id},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1003,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'POSITION', endPos : {posX : 9, posY : 9}},
            rotation: {type: 'POSITION', degrees: 100},
          }
        ],
      } ],
    };
    // First, the player moves to the ball to pick it up.
    expect(positionForKeyframeHelper(player1, 1, state)).toEqual({posX : 1, posY : 1, rotation: 100});
    expect(positionForKeyframeHelper(player1, 2, state)).toEqual({posX : 2, posY : 2, rotation: 100});
    expect(positionForKeyframeHelper(player1, 3, state)).toEqual({posX : 3, posY : 3, rotation: 100});
    expect(positionForKeyframeHelper(player1, 4, state)).toEqual({posX : 4, posY : 4, rotation: 100});
    expect(positionForKeyframeHelper(player1, 5, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    // Then, he moves with the ball.
    for (const entity of [player1, volleyball]) {
      expect(positionForKeyframeHelper(entity, 6, state)).toEqual({posX : 6, posY : 6, rotation: 100});
      expect(positionForKeyframeHelper(entity, 7, state)).toEqual({posX : 7, posY : 7, rotation: 100});
      expect(positionForKeyframeHelper(entity, 8, state)).toEqual({posX : 8, posY : 8, rotation: 100});
      expect(positionForKeyframeHelper(entity, 9, state)).toEqual({posX : 9, posY : 9, rotation: 100});
      expect(positionForKeyframeHelper(entity, 100, state)).toEqual({posX : 9, posY : 9, rotation: 100});
    }
  });

  it('should return position for moving with and then spiking a ball', () => {
    // This should simulate a player starting with a ball, moving, and then throwing it to a ball and moving with it.
    const player1: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_white',
    };
    const volleyball: Entity = {
      id : 2,
      type : EntityType.VOLLEYBALL,
      icon : 'volleyball',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        entities : [ player1, volleyball ],
        actions : [
          {
            id : 1000,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
            rotation: {type: 'POSITION', degrees: 100},
        },
          {
            id : 1001,
            targetId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'ENTITY', entityId: player1.id},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1002,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'POSITION', endPos : {posX: 5, posY: 5}},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1003,
            targetId : volleyball.id,
            type : BallActions.SPIKE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'POSITION', endPos : {posX : 9, posY : 9}},
            rotation: {type: 'POSITION', degrees: 100},
          }
        ],
      } ],
    };
    // First, the player moves with the ball.
    for (const entity of [player1, volleyball]) {
      expect(positionForKeyframeHelper(entity, 0, state)).toEqual({posX : 1, posY : 1, rotation: 100});
      expect(positionForKeyframeHelper(entity, 1, state)).toEqual({posX : 1, posY : 1, rotation: 100});
      expect(positionForKeyframeHelper(entity, 2, state)).toEqual({posX : 2, posY : 2, rotation: 100});
      expect(positionForKeyframeHelper(entity, 3, state)).toEqual({posX : 3, posY : 3, rotation: 100});
      expect(positionForKeyframeHelper(entity, 4, state)).toEqual({posX : 4, posY : 4, rotation: 100});
      expect(positionForKeyframeHelper(entity, 5, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    }
    // Then, he spikes the ball
    expect(positionForKeyframeHelper(volleyball, 6, state)).toEqual({posX : 6, posY : 6, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 7, state)).toEqual({posX : 7, posY : 7, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 8, state)).toEqual({posX : 8, posY : 8, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 9, state)).toEqual({posX : 9, posY : 9, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 10, state)).toEqual({posX : 9, posY : 9, rotation: 100});
  });

  it('should return position for picking up ball, spiking it, and then moving', () => {
    const player1: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_white',
    };
    const volleyball: Entity = {
      id : 2,
      type : EntityType.VOLLEYBALL,
      icon : 'volleyball',
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        entities : [ player1, volleyball ],
        actions : [
          {
            id : 1000,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1001,
            targetId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1002,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : volleyball.id},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1003,
            targetId : volleyball.id,
            type : BallActions.SPIKE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'POSITION', endPos : {posX : 9, posY : 9}},
            rotation: {type: 'POSITION', degrees: 100},
          },
          {
            id : 1004,
            targetId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 9,
            endFrame : 13,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
            rotation: {type: 'POSITION', degrees: 100},
          }
        ],
      } ],
    };
    // First, the player moves to ball.
    expect(positionForKeyframeHelper(player1, 0, state)).toEqual({posX : 1, posY : 1, rotation: 100});
    expect(positionForKeyframeHelper(player1, 1, state)).toEqual({posX : 1, posY : 1, rotation: 100});
    expect(positionForKeyframeHelper(player1, 2, state)).toEqual({posX : 2, posY : 2, rotation: 100});
    expect(positionForKeyframeHelper(player1, 3, state)).toEqual({posX : 3, posY : 3, rotation: 100});
    expect(positionForKeyframeHelper(player1, 4, state)).toEqual({posX : 4, posY : 4, rotation: 100});
    expect(positionForKeyframeHelper(player1, 5, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    // Then, he spikes the b, rotation: 100all
    expect(positionForKeyframeHelper(volleyball, 6, state)).toEqual({posX : 6, posY : 6, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 7, state)).toEqual({posX : 7, posY : 7, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 8, state)).toEqual({posX : 8, posY : 8, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 9, state)).toEqual({posX : 9, posY : 9, rotation: 100});
    expect(positionForKeyframeHelper(volleyball, 10, state)).toEqual({posX : 9, posY : 9, rotation: 100});
    // Then, he mov, rotation: 100es.
    expect(positionForKeyframeHelper(player1, 9, state)).toEqual({posX : 5, posY : 5, rotation: 100});
    expect(positionForKeyframeHelper(player1, 10, state)).toEqual({posX : 4, posY : 4, rotation: 100});
    expect(positionForKeyframeHelper(player1, 11, state)).toEqual({posX : 3, posY : 3, rotation: 100});
    expect(positionForKeyframeHelper(player1, 12, state)).toEqual({posX : 2, posY : 2, rotation: 100});
    expect(positionForKeyframeHelper(player1, 13, state)).toEqual({posX : 1, posY : 1, rotation: 100});
  });
});
