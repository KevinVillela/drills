import { drillsReducer, initialState, AddPosition, Position, DrillsState, EntityType } from './model';

fdescribe('drillsReducer', () => {
    let pos1: Position;
    let pos2: Position;
    let pos3: Position;
    let pos4: Position;
    let pos5: Position;
    let pos6: Position;
    let pos7: Position;
    let pos8: Position;
    let stateAfterAdd: DrillsState;

    beforeEach(() => {
        pos1 = { posX: 1, posY: 1 };
        pos2 = { posX: 2, posY: 2 };
        pos3 = { posX: 3, posY: 3 };
        pos4 = { posX: 4, posY: 4 };
        pos5 = { posX: 5, posY: 5 };
        pos6 = { posX: 6, posY: 6 };
        pos7 = { posX: 7, posY: 7 };
        pos8 = { posX: 8, posY: 8 };
        stateAfterAdd = {
            ...initialState, entities: [{
                type: EntityType.VOLLEYBALL,
                animation: [pos1],
            }]
        };
    })

    it('should AddPosition with interpolate of 0', () => {
        stateAfterAdd.interpolate = 0;
        expect(drillsReducer(stateAfterAdd, new AddPosition(0, 0, pos2)))
            .toEqual({
                ...stateAfterAdd, entities: [{
                    type: EntityType.VOLLEYBALL,
                    animation: [pos2]
                }], keyframeIndex: 0,
            });
    });

    it('should AddPosition with interpolate of 1', () => {
        stateAfterAdd.interpolate = 1;
        expect(drillsReducer(stateAfterAdd, new AddPosition(0, 0, pos2)))
            .toEqual({
                ...stateAfterAdd, entities: [{
                    type: EntityType.VOLLEYBALL,
                    animation: [pos1, pos2]
                }], keyframeIndex: 1,
            });
    });

    it('should AddPosition with interpolate of 4', () => {
        stateAfterAdd.interpolate = 4;
        expect(drillsReducer(stateAfterAdd, new AddPosition(0, 0, pos5)))
            .toEqual({
                ...stateAfterAdd, entities: [{
                    type: EntityType.VOLLEYBALL,
                    animation: [pos1, pos2, pos3, pos4, pos5]
                }], keyframeIndex: 4,
            });
    });

    it('should AddPosition with interpolate of 0 in middle', () => {
        expect(drillsReducer({
            ...initialState, entities: [{
                type: EntityType.VOLLEYBALL,
                animation: [pos1, pos2, pos3],
            }],
            interpolate: 0,
        }, new AddPosition(0, 1, pos5)))
            .toEqual({
                ...initialState, entities: [{
                    type: EntityType.VOLLEYBALL,
                    animation: [pos1, pos5, pos3],
                }],
                interpolate: 0,
            });
    });

    it('should AddPosition with interpolate of 1 in middle', () => {
        expect(drillsReducer({
            ...initialState, entities: [{
                type: EntityType.VOLLEYBALL,
                animation: [pos1, pos2, pos3, pos4],
            }],
            interpolate: 1,
        }, new AddPosition(0, 1, pos5)))
            .toEqual({
                ...initialState, entities: [{
                    type: EntityType.VOLLEYBALL,
                    animation: [pos1, pos2, pos5, pos4],
                }],
                interpolate: 1,
                keyframeIndex: 1,
            });
    });

    it('should AddPosition with interpolate of 3 in middle', () => {
        expect(drillsReducer({
            ...initialState, entities: [{
                type: EntityType.VOLLEYBALL,
                animation: [pos1, pos2, pos3, pos4, pos5],
            }],
            interpolate: 3,
        }, new AddPosition(0, 1, pos8)))
            .toEqual({
                ...initialState, entities: [{
                    type: EntityType.VOLLEYBALL,
                    animation: [pos1, pos2, pos4, pos6, pos8],
                }],
                interpolate: 3,
                keyframeIndex: 3,
            });
    });
});