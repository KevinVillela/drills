import { EntityAction, PlayerActions, Animation, EntityType } from './types';

export interface Template {
  name: string;
  animation: Partial<Animation>;
}

const SIX_VS_SIX: Partial<Animation> = {
  entities: [
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 0
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 1
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 2
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 3
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 4
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 5
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_green',
      id: 6
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_green',
      id: 7
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_green',
      id: 8
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_green',
      id: 9
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_green',
      id: 10
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_green',
      id: 11
    }
  ],
  actions: [
  {
    id: 1000,
    targetId: 0,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 91,
        posY: 97
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1001,
    targetId: 1,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 147,
        posY: 80
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1002,
    targetId: 2,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 212,
        posY: 99
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1003,
    targetId: 3,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 89,
        posY: 221
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1004,
    targetId: 4,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 146,
        posY: 223
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1005,
    targetId: 5,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 206,
        posY: 223
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1006,
    targetId: 6,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 87,
        posY: 272
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 270
    },
    jumping: false
  },
  {
    id: 1007,
    targetId: 7,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 145,
        posY: 272
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 270
    },
    jumping: false
  },
  {
    id: 1008,
    targetId: 8,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 203,
        posY: 272
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 270
    },
    jumping: false
  },
  {
    id: 1009,
    targetId: 9,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 82,
        posY: 387
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 270
    },
    jumping: false
  },
  {
    id: 1010,
    targetId: 10,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 142,
        posY: 413
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 270
    },
    jumping: false
  },
  {
    id: 1011,
    targetId: 11,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 205,
        posY: 389
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 270
    },
    jumping: false
  }
]};

const SIX_VS_ZERO: Partial<Animation> = {
  entities: [
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 0
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 1
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 2
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 3
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 4
    },
    {
      type: EntityType.PLAYER,
      icon: 'player_white',
      id: 5
    },
  ],
  actions: [
  {
    id: 1000,
    targetId: 0,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 91,
        posY: 97
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1001,
    targetId: 1,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 147,
        posY: 80
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1002,
    targetId: 2,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 212,
        posY: 99
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1003,
    targetId: 3,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 89,
        posY: 221
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1004,
    targetId: 4,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 146,
        posY: 223
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
  {
    id: 1005,
    targetId: 5,
    type: PlayerActions.MOVE,
    startFrame: 0,
    endFrame: 1,
    end: {
      type: 'POSITION',
      endPos: {
        posX: 206,
        posY: 223
      }
    },
    rotation: {
      type: 'POSITION',
      degrees: 90
    },
    jumping: false
  },
]};

export const TEMPLATES: Template[] = [{
  name: '6 vs 6',
  animation: SIX_VS_SIX,
}, {
  name: '6 vs 0',
  animation: SIX_VS_ZERO,
}];
