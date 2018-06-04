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
          actionId : 1000,
          sourceId : player.id,
          type : PlayerActions.MOVE,
          startFrame : 0,
          endFrame : 1,
          end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
        } ]
      } ]
    };
    expect(positionForKeyframeHelper(player, 1, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(player, 100, state)).toEqual({posX : 1, posY : 1});
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
            actionId : 1000,
            sourceId : player.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          },
          {
            actionId : 1001,
            sourceId : player.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          }
        ],
      } ],
    };
    expect(positionForKeyframeHelper(player, 0, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(player, 1, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(player, 2, state)).toEqual({posX : 2, posY : 2});
    expect(positionForKeyframeHelper(player, 3, state)).toEqual({posX : 3, posY : 3});
    expect(positionForKeyframeHelper(player, 4, state)).toEqual({posX : 4, posY : 4});
    expect(positionForKeyframeHelper(player, 5, state)).toEqual({posX : 5, posY : 5});
    expect(positionForKeyframeHelper(player, 100, state)).toEqual({posX : 5, posY : 5});
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
            actionId : 1000,
            sourceId : player.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          },
          {
            actionId : 1001,
            sourceId : 1,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          },
          {
            actionId : 1002,
            sourceId : 1,
            type : PlayerActions.MOVE,
            startFrame : 5,
            endFrame : 10,
            end : {type : 'POSITION', endPos : {posX : 10, posY : 10}},
          }
        ],
      } ],
    };
    expect(positionForKeyframeHelper(player, 1, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(player, 2, state)).toEqual({posX : 2, posY : 2});
    expect(positionForKeyframeHelper(player, 3, state)).toEqual({posX : 3, posY : 3});
    expect(positionForKeyframeHelper(player, 4, state)).toEqual({posX : 4, posY : 4});
    expect(positionForKeyframeHelper(player, 5, state)).toEqual({posX : 5, posY : 5});
    expect(positionForKeyframeHelper(player, 6, state)).toEqual({posX : 6, posY : 6});
    expect(positionForKeyframeHelper(player, 7, state)).toEqual({posX : 7, posY : 7});
    expect(positionForKeyframeHelper(player, 8, state)).toEqual({posX : 8, posY : 8});
    expect(positionForKeyframeHelper(player, 9, state)).toEqual({posX : 9, posY : 9});
    expect(positionForKeyframeHelper(player, 10, state)).toEqual({posX : 10, posY : 10});
    expect(positionForKeyframeHelper(player, 100, state)).toEqual({posX : 10, posY : 10});
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
          actionId : 1000,
          sourceId : player.id,
          type : PlayerActions.MOVE,
          startFrame : 0,
          endFrame : 1,
          end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
        }, {
          actionId : 1001,
          sourceId : volleyball.id,
          type : BallActions.TOSS,
          startFrame : 0,
          endFrame : 1,
          end : {type : 'ENTITY', entityId : 1},
        }, {
          actionId : 1001,
          sourceId : 1,
          type : PlayerActions.MOVE,
          startFrame : 1,
          endFrame : 5,
          end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
        } ],
      } ],
    };
    for (const entity of [player, volleyball]) {
      expect(positionForKeyframeHelper(entity, 0, state)).toEqual({posX : 1, posY : 1});
      expect(positionForKeyframeHelper(entity, 1, state)).toEqual({posX : 1, posY : 1});
      expect(positionForKeyframeHelper(entity, 2, state)).toEqual({posX : 2, posY : 2});
      expect(positionForKeyframeHelper(entity, 3, state)).toEqual({posX : 3, posY : 3});
      expect(positionForKeyframeHelper(entity, 4, state)).toEqual({posX : 4, posY : 4});
      expect(positionForKeyframeHelper(entity, 5, state)).toEqual({posX : 5, posY : 5});
      expect(positionForKeyframeHelper(entity, 100, state)).toEqual({posX : 5, posY : 5});
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
            actionId : 1000,
            sourceId : player.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          }, {
            actionId : 1001,
            sourceId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          }, {
            actionId : 1002,
            sourceId : 2,
            type : BallActions.SPIKE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : 1},
          },
          {
            actionId : 1003,
            sourceId : 1,
            type : PlayerActions.MOVE,
            startFrame : 5,
            endFrame : 10,
            end : {type : 'POSITION', endPos : {posX : 10, posY : 10}},
          }
        ],
      } ],
    };
    // First, the ball is hit at the player
    expect(positionForKeyframeHelper(volleyball, 1, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(volleyball, 2, state)).toEqual({posX : 2, posY : 2});
    expect(positionForKeyframeHelper(volleyball, 3, state)).toEqual({posX : 3, posY : 3});
    expect(positionForKeyframeHelper(volleyball, 4, state)).toEqual({posX : 4, posY : 4});
    expect(positionForKeyframeHelper(volleyball, 5, state)).toEqual({posX : 5, posY : 5});
    // The player now has possession of the ball, and will start moving with it.
    for (const entity of [player, volleyball]) {
      expect(positionForKeyframeHelper(entity, 6, state)).toEqual({posX : 6, posY : 6});
      expect(positionForKeyframeHelper(entity, 7, state)).toEqual({posX : 7, posY : 7});
      expect(positionForKeyframeHelper(entity, 8, state)).toEqual({posX : 8, posY : 8});
      expect(positionForKeyframeHelper(entity, 9, state)).toEqual({posX : 9, posY : 9});
      expect(positionForKeyframeHelper(entity, 10, state)).toEqual({posX : 10, posY : 10});
      expect(positionForKeyframeHelper(entity, 100, state)).toEqual({posX : 10, posY : 10});
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
            actionId : 1000,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          },
          {
            actionId : 1001,
            sourceId : player2.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          },
          {
            actionId : 1002,
            sourceId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'ENTITY', entityId : 1},
          },
          {
            actionId : 1003,
            sourceId : 2,
            type : BallActions.SPIKE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : 3},
          },
          {
            actionId : 1004,
            sourceId : 2,
            type : BallActions.SPIKE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'ENTITY', entityId : 1},
          }
        ],
      } ],
    };
    // First, the ball is hit at the second player
    expect(positionForKeyframeHelper(volleyball, 1, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(volleyball, 2, state)).toEqual({posX : 2, posY : 2});
    expect(positionForKeyframeHelper(volleyball, 3, state)).toEqual({posX : 3, posY : 3});
    expect(positionForKeyframeHelper(volleyball, 4, state)).toEqual({posX : 4, posY : 4});
    expect(positionForKeyframeHelper(volleyball, 5, state)).toEqual({posX : 5, posY : 5});
    // Then, the ball is hit back at the first player
    expect(positionForKeyframeHelper(volleyball, 6, state)).toEqual({posX : 4, posY : 4});
    expect(positionForKeyframeHelper(volleyball, 7, state)).toEqual({posX : 3, posY : 3});
    expect(positionForKeyframeHelper(volleyball, 8, state)).toEqual({posX : 2, posY : 2});
    expect(positionForKeyframeHelper(volleyball, 9, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(volleyball, 10, state)).toEqual({posX : 1, posY : 1});
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
            actionId : 1000,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          },
          {
            actionId : 1001,
            sourceId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          },
          {
            actionId : 1002,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : volleyball.id},
          },
          {
            actionId : 1003,
            sourceId : volleyball.id,
            type : BallActions.SPIKE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'POSITION', endPos : {posX : 9, posY : 9}},
          }
        ],
      } ],
    };
    // First, the player moves to the ball
    expect(positionForKeyframeHelper(player1, 1, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(player1, 2, state)).toEqual({posX : 2, posY : 2});
    expect(positionForKeyframeHelper(player1, 3, state)).toEqual({posX : 3, posY : 3});
    expect(positionForKeyframeHelper(player1, 4, state)).toEqual({posX : 4, posY : 4});
    expect(positionForKeyframeHelper(player1, 5, state)).toEqual({posX : 5, posY : 5});
    // Then, he hits the ball. The player should stay in the same spot.
    expect(positionForKeyframeHelper(player1, 6, state)).toEqual({posX : 5, posY : 5});
    expect(positionForKeyframeHelper(player1, 7, state)).toEqual({posX : 5, posY : 5});
    expect(positionForKeyframeHelper(player1, 8, state)).toEqual({posX : 5, posY : 5});
    expect(positionForKeyframeHelper(player1, 9, state)).toEqual({posX : 5, posY : 5});
    expect(positionForKeyframeHelper(player1, 10, state)).toEqual({posX : 5, posY : 5});
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
            actionId : 1000,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          },
          {
            actionId : 1001,
            sourceId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          },
          {
            actionId : 1002,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : volleyball.id},
          },
          {
            actionId : 1003,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'POSITION', endPos : {posX : 9, posY : 9}},
          }
        ],
      } ],
    };
    // First, the player moves to the ball to pick it up.
    expect(positionForKeyframeHelper(player1, 1, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(player1, 2, state)).toEqual({posX : 2, posY : 2});
    expect(positionForKeyframeHelper(player1, 3, state)).toEqual({posX : 3, posY : 3});
    expect(positionForKeyframeHelper(player1, 4, state)).toEqual({posX : 4, posY : 4});
    expect(positionForKeyframeHelper(player1, 5, state)).toEqual({posX : 5, posY : 5});
    // Then, he moves with the ball.
    for (const entity of [player1, volleyball]) {
      expect(positionForKeyframeHelper(entity, 6, state)).toEqual({posX : 6, posY : 6});
      expect(positionForKeyframeHelper(entity, 7, state)).toEqual({posX : 7, posY : 7});
      expect(positionForKeyframeHelper(entity, 8, state)).toEqual({posX : 8, posY : 8});
      expect(positionForKeyframeHelper(entity, 9, state)).toEqual({posX : 9, posY : 9});
      expect(positionForKeyframeHelper(entity, 100, state)).toEqual({posX : 9, posY : 9});
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
            actionId : 1000,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          },
          {
            actionId : 1001,
            sourceId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'ENTITY', entityId: player1.id},
          },
          {
            actionId : 1002,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'POSITION', endPos : {posX: 5, posY: 5}},
          },
          {
            actionId : 1003,
            sourceId : volleyball.id,
            type : BallActions.SPIKE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'POSITION', endPos : {posX : 9, posY : 9}},
          }
        ],
      } ],
    };
    // First, the player moves with the ball.
    for (const entity of [player1, volleyball]) {
      expect(positionForKeyframeHelper(entity, 0, state)).toEqual({posX : 1, posY : 1});
      expect(positionForKeyframeHelper(entity, 1, state)).toEqual({posX : 1, posY : 1});
      expect(positionForKeyframeHelper(entity, 2, state)).toEqual({posX : 2, posY : 2});
      expect(positionForKeyframeHelper(entity, 3, state)).toEqual({posX : 3, posY : 3});
      expect(positionForKeyframeHelper(entity, 4, state)).toEqual({posX : 4, posY : 4});
      expect(positionForKeyframeHelper(entity, 5, state)).toEqual({posX : 5, posY : 5});
    }
    // Then, he spikes the ball
    expect(positionForKeyframeHelper(volleyball, 6, state)).toEqual({posX : 6, posY : 6});
    expect(positionForKeyframeHelper(volleyball, 7, state)).toEqual({posX : 7, posY : 7});
    expect(positionForKeyframeHelper(volleyball, 8, state)).toEqual({posX : 8, posY : 8});
    expect(positionForKeyframeHelper(volleyball, 9, state)).toEqual({posX : 9, posY : 9});
    expect(positionForKeyframeHelper(volleyball, 10, state)).toEqual({posX : 9, posY : 9});
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
            actionId : 1000,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          },
          {
            actionId : 1001,
            sourceId : volleyball.id,
            type : PlayerActions.MOVE,
            startFrame : 0,
            endFrame : 1,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          },
          {
            actionId : 1002,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'ENTITY', entityId : volleyball.id},
          },
          {
            actionId : 1003,
            sourceId : volleyball.id,
            type : BallActions.SPIKE,
            startFrame : 5,
            endFrame : 9,
            end : {type : 'POSITION', endPos : {posX : 9, posY : 9}},
          },
          {
            actionId : 1004,
            sourceId : player1.id,
            type : PlayerActions.MOVE,
            startFrame : 9,
            endFrame : 13,
            end : {type : 'POSITION', endPos : {posX : 1, posY : 1}},
          }
        ],
      } ],
    };
    // First, the player moves to ball.
    expect(positionForKeyframeHelper(player1, 0, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(player1, 1, state)).toEqual({posX : 1, posY : 1});
    expect(positionForKeyframeHelper(player1, 2, state)).toEqual({posX : 2, posY : 2});
    expect(positionForKeyframeHelper(player1, 3, state)).toEqual({posX : 3, posY : 3});
    expect(positionForKeyframeHelper(player1, 4, state)).toEqual({posX : 4, posY : 4});
    expect(positionForKeyframeHelper(player1, 5, state)).toEqual({posX : 5, posY : 5});
    // Then, he spikes the ball
    expect(positionForKeyframeHelper(volleyball, 6, state)).toEqual({posX : 6, posY : 6});
    expect(positionForKeyframeHelper(volleyball, 7, state)).toEqual({posX : 7, posY : 7});
    expect(positionForKeyframeHelper(volleyball, 8, state)).toEqual({posX : 8, posY : 8});
    expect(positionForKeyframeHelper(volleyball, 9, state)).toEqual({posX : 9, posY : 9});
    expect(positionForKeyframeHelper(volleyball, 10, state)).toEqual({posX : 9, posY : 9});
    // Then, he moves.
    expect(positionForKeyframeHelper(player1, 9, state)).toEqual({posX : 5, posY : 5});
    expect(positionForKeyframeHelper(player1, 10, state)).toEqual({posX : 4, posY : 4});
    expect(positionForKeyframeHelper(player1, 11, state)).toEqual({posX : 3, posY : 3});
    expect(positionForKeyframeHelper(player1, 12, state)).toEqual({posX : 2, posY : 2});
    expect(positionForKeyframeHelper(player1, 13, state)).toEqual({posX : 1, posY : 1});
  });
  // it('should AddPosition with interpolate of 0', () => {
  //     stateAfterAdd.interpolate = 0;
  //     expect(drillsReducer(stateAfterAdd, new AddPosition(0, 0, pos2)))
  //         .toEqual({
  //             ...stateAfterAdd, entities: [{
  //                 type: EntityType.VOLLEYBALL,
  //                 animation: [pos2]
  //             }], keyframeIndex: 0,
  //         });
  // });

  // it('should AddPosition with interpolate of 1', () => {
  //     stateAfterAdd.interpolate = 1;
  //     expect(drillsReducer(stateAfterAdd, new AddPosition(0, 0, pos2)))
  //         .toEqual({
  //             ...stateAfterAdd, entities: [{
  //                 type: EntityType.VOLLEYBALL,
  //                 animation: [pos1, pos2]
  //             }], keyframeIndex: 1,
  //         });
  // });

  // it('should AddPosition with interpolate of 4', () => {
  //     stateAfterAdd.interpolate = 4;
  //     expect(drillsReducer(stateAfterAdd, new AddPosition(0, 0, pos5)))
  //         .toEqual({
  //             ...stateAfterAdd, entities: [{
  //                 type: EntityType.VOLLEYBALL,
  //                 animation: [pos1, pos2, pos3, pos4, pos5]
  //             }], keyframeIndex: 4,
  //         });
  // });

  // it('should AddPosition with interpolate of 0 in middle', () => {
  //     expect(drillsReducer({
  //         ...initialState, entities: [{
  //             type: EntityType.VOLLEYBALL,
  //             animation: [pos1, pos2, pos3],
  //         }],
  //         interpolate: 0,
  //     }, new AddPosition(0, 1, pos5)))
  //         .toEqual({
  //             ...initialState, entities: [{
  //                 type: EntityType.VOLLEYBALL,
  //                 animation: [pos1, pos5, pos3],
  //             }],
  //             interpolate: 0,
  //         });
  // });

  // it('should AddPosition with interpolate of 1 in middle', () => {
  //     expect(drillsReducer({
  //         ...initialState, entities: [{
  //             type: EntityType.VOLLEYBALL,
  //             animation: [pos1, pos2, pos3, pos4],
  //         }],
  //         interpolate: 1,
  //     }, new AddPosition(0, 1, pos5)))
  //         .toEqual({
  //             ...initialState, entities: [{
  //                 type: EntityType.VOLLEYBALL,
  //                 animation: [pos1, pos2, pos5, pos4],
  //             }],
  //             interpolate: 1,
  //             keyframeIndex: 1,
  //         });
  // });

  // it('should AddPosition with interpolate of 3 in middle', () => {
  //     expect(drillsReducer({
  //         ...initialState, entities: [{
  //             type: EntityType.VOLLEYBALL,
  //             animation: [pos1, pos2, pos3, pos4, pos5],
  //         }],
  //         interpolate: 3,
  //     }, new AddPosition(0, 1, pos8)))
  //         .toEqual({
  //             ...initialState, entities: [{
  //                 type: EntityType.VOLLEYBALL,
  //                 animation: [pos1, pos2, pos4, pos6, pos8],
  //             }],
  //             interpolate: 3,
  //             keyframeIndex: 3,
  //         });
  // });
});
