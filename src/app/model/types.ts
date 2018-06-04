export enum BallActions {
  SET = 'SET',
  SPIKE = 'SPIKE',
  BUMP = 'BUMP',
  TOSS = 'TOSS',
}

export enum PlayerActions {
  JUMP = 'JUMP',
  MOVE = 'MOVE'
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
  // TODO change to ID
  actionId: number;
  /**
   * The entity ID of the entity that the action is being performed on.
   * TODO change to targetId.
   */
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
}

export interface Possession {
  ballId: number;
  playerId: number;
  determinantId: number;
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

/** State about the drill itself */
export interface Drill {
  animations: Animation[];
  name: string;
  description: string;
  /** A number between 1 and 5 representing the minumum level needed for this drill. */
  minLevel: number;
  /** A number between 1 and 5 representing the maximum level this drill is useful for. */
  maxLevel: number;
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
}

export interface DrillsState extends Drill {
  // Playback state (could probably be a different store)
  /** The currently selected entity ID, if any. */
  selectedEntityId?: number;
  keyframeIndex: number;
  speed: number;
  interpolate: number;
  past: number;
}

export enum EntityType {
  VOLLEYBALL = 'VOLLEYBALL',
  PLAYER = 'PLAYER'
}

export interface Position {
  posX: number;
  posY: number;
}

/**
 * Represents an entity on the court. Note that this does not contain eny
 * information about where the entity is on the court, including a Start Position - that is reserved
 * for actions.
 */
export interface Entity {
  id: number;
  type: EntityType;
  icon: string;
}

export interface Animation {
  entities: Entity[];
  actions: EntityAction[];
}
