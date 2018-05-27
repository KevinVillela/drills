import {AnimationService, positionForKeyframeHelper} from './animation';
import {initialState} from './model';
import {BallActions, DrillsState, Entity, EntityType, PlayerActions} from './types';

// import { drillsReducer, initialState, AddPosition, Position, DrillsState, EntityType } from
// './model';

fdescribe('animations', () => {
  // let pos1: Position;
  // let pos2: Position;
  // let pos3: Position;
  // let pos4: Position;
  // let pos5: Position;
  // let pos6: Position;
  // let pos7: Position;
  // let pos8: Position;
  // let stateAfterAdd: DrillsState;

  // beforeEach(() => {
  //     pos1 = { posX: 1, posY: 1 };
  //     pos2 = { posX: 2, posY: 2 };
  //     pos3 = { posX: 3, posY: 3 };
  //     pos4 = { posX: 4, posY: 4 };
  //     pos5 = { posX: 5, posY: 5 };
  //     pos6 = { posX: 6, posY: 6 };
  //     pos7 = { posX: 7, posY: 7 };
  //     pos8 = { posX: 8, posY: 8 };
  //     stateAfterAdd = {
  //         ...initialState, entities: [{
  //             type: EntityType.VOLLEYBALL,
  //             animation: [pos1],
  //         }]
  //     };
  // });

  it('should return start position for no actions at the start', () => {
    const state = expect(positionForKeyframeHelper({
                    id : 1,
                    type : EntityType.PLAYER,
                    icon : 'player_blue',
                    start : {type : 'POSITION', endPos : {posX : 1, posY : 1}}
                  },
                                                   1, {
                                                     ...initialState,
                                                   }))
                      .toEqual({posX : 1, posY : 1});
  });

  it('should return start position for no actions in the future', () => {
    expect(positionForKeyframeHelper({
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_blue',
      start : {type : 'POSITION', endPos : {posX : 1, posY : 1}}
    },
                                     100, {
                                       ...initialState,
                                     }))
        .toEqual({posX : 1, posY : 1});
  });

  it('should return position for one action', () => {
    const player: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_blue',
      start : {type : 'POSITION', endPos : {posX : 1, posY : 1}}
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        actions : [ {
          actionId : 1000,
          sourceId : 1,
          type : PlayerActions.MOVE,
          startFrame : 1,
          endFrame : 5,
          end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          entityIds : [ 1 ],
        } ],
      } ],
    };
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
      start : {type : 'POSITION', endPos : {posX : 1, posY : 1}}
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        actions : [
          {
            actionId : 1000,
            sourceId : 1,
            type : PlayerActions.MOVE,
            startFrame : 1,
            endFrame : 5,
            end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
            entityIds : [ 1 ],
          },
          {
            actionId : 1001,
            sourceId : 1,
            type : PlayerActions.MOVE,
            startFrame : 5,
            endFrame : 10,
            end : {type : 'POSITION', endPos : {posX : 10, posY : 10}},
            entityIds : [ 1 ],
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
      start : {type : 'POSITION', endPos : {posX : 1, posY : 1}}
    };
    const volleyball: Entity = {
      id : 2,
      type : EntityType.VOLLEYBALL,
      icon : 'volleyball',
      start : {type : 'ENTITY', entityId: 1}
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        entities : [ player, volleyball ],
        actions : [ {
          actionId : 1000,
          sourceId : 1,
          type : PlayerActions.MOVE,
          startFrame : 1,
          endFrame : 5,
          end : {type : 'POSITION', endPos : {posX : 5, posY : 5}},
          entityIds : [ 1 ],
        } ],
        possessions: [{
          ballId: 2,
          playerId: 1,
          startFrame: 1,
        }]
      } ],
    };
    for (const entity of [player, volleyball]) {
      expect(positionForKeyframeHelper(entity, 1, state)).toEqual({posX : 1, posY : 1});
      expect(positionForKeyframeHelper(entity, 2, state)).toEqual({posX : 2, posY : 2});
      expect(positionForKeyframeHelper(entity, 3, state)).toEqual({posX : 3, posY : 3});
      expect(positionForKeyframeHelper(entity, 4, state)).toEqual({posX : 4, posY : 4});
      expect(positionForKeyframeHelper(entity, 5, state)).toEqual({posX : 5, posY : 5});
      expect(positionForKeyframeHelper(entity, 100, state)).toEqual({posX : 5, posY : 5});
    }
  });

  it('should return position for one action with possession', () => {
    // TODO CONSIDER GETTING RID OF ENTITYIDS IN ACTION
    // This should simulate a ball being passed to a player
    const player: Entity = {
      id : 1,
      type : EntityType.PLAYER,
      icon : 'player_blue',
      start : {type : 'POSITION', endPos : {posX : 5, posY : 5}}
    };
    const volleyball: Entity = {
      id : 2,
      type : EntityType.VOLLEYBALL,
      icon : 'volleyball',
      start : {type : 'POSITION', endPos : {posX : 1, posY : 1}}
    };
    const state: DrillsState = {
      ...initialState,
      animations : [ {
        ...initialState.animations[0],
        entities : [ player, volleyball ],
        actions : [ {
          actionId : 1000,
          sourceId : 2,
          type : BallActions.SPIKE,
          startFrame : 1,
          endFrame : 5,
          end : {type : 'ENTITY', entityId : 1},
          entityIds : [ 2 ],
        }, {
          actionId : 1001,
          sourceId : 1,
          type : PlayerActions.MOVE,
          startFrame : 5,
          endFrame : 10,
          end : {type : 'POSITION', endPos : {posX: 10, posY: 10}},
          entityIds : [ 1 ],
        } ],
        possessions : [ {
          ballId : 2,
          playerId : 1,
          startFrame : 5,
        } ],
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
