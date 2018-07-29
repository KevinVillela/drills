import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatInputBase, MatSliderChange} from '@angular/material';
import {Store} from '@ngrx/store';
import {EventEmitter} from 'events';
import {fabric} from 'fabric';
import {Observable} from 'rxjs/Observable';
import {combineLatest as combineLatestStatic} from 'rxjs/observable/combineLatest';
import {combineLatest, map, mapTo, merge, mergeMap, tap, withLatestFrom, switchMap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {actionForKeyframe, AnimationService} from '../model/animation';
import {
  AddAction,
  AddEntity,
  currentEntity,
  DeleteEntity,
  getDrawState,
  getEntities,
  getId,
  getSelectedEntityId,
  maxAnimationLength,
  NextFrame,
  percentOfAction,
  percentOfActionHelper,
  SelectEntity,
  InterpolateChange,
  PastChange,
  UpdateKeyframeIndex,
  getDrillId,
  NextEntityColor,
  SpeedChange,
  getSpeed,
  MIN_FPS,
  MAX_FPS,
} from '../model/model';
import {
  AbsolutePosition,
  AnimationEnd,
  BallActions,
  DrillsState,
  Entity,
  EntityAction,
  EntityType,
  PlayerActions,
  Position
} from '../model/types';

import {IconService} from './icons';
import { interval } from 'rxjs/observable/interval';

export const COURT_SIZE = 400;
export const COURT_BORDER = 50;

@Component({
  selector : 'drills-court',
  templateUrl : './court.component.html',
  styleUrls : [ './court.component.css' ],
  changeDetection : ChangeDetectionStrategy.OnPush,
  providers: [IconService],
})
export class CourtComponent implements OnInit, AfterViewInit {
  max: Observable<number>;
  currentEntity: Entity|undefined;
  interpolate: number;
  past: number;
  entities: Observable<Entity[]>;
  keyframeIndex = 0;
  canvas: fabric.Canvas;
  speed: number;
  readonly minFps = MIN_FPS;
  readonly maxFps = MAX_FPS;

  @Input() drillId: string|undefined;
  @Input() mode: 'edit'|'view' = 'edit';

  private selectedEntityId: number|undefined = undefined;
  readonly playing = new BehaviorSubject<boolean>(false);
  /** A map from entity-offset combo to if it is animating or not. */
  private readonly isAnimating = new Map<string, boolean>();

  constructor(private readonly el: ElementRef,
              private readonly store: Store<{drillsState: DrillsState}>,
              private readonly cd: ChangeDetectorRef, private readonly iconService: IconService,
              private readonly animationService: AnimationService) {}

  ngOnInit() {
    this.max = this.store.select(maxAnimationLength);
    this.cd.markForCheck();
    this.store.select(state => state.drillsState.keyframeIndex).subscribe(val => {
      this.keyframeIndex = val;
      this.cd.detectChanges();
    });
    this.entities = this.store.select(getEntities);
    this.store.select(state => state.drillsState.interpolate)
        .subscribe(val => { this.interpolate = val; });
    this.store.select(state => state.drillsState.past).subscribe(val => { this.past = val; });
    this.store.select(getSelectedEntityId).subscribe(val => { this.selectedEntityId = val; });
    this.store.select(currentEntity).subscribe(entity => { this.currentEntity = entity; });
    this.store.select(getSpeed).subscribe(speed => {
      this.speed = speed;
    });
    combineLatestStatic(this.playing, this.store.select((state) => state.drillsState.speed))
    .pipe(switchMap(([_, period]) => interval(period)))
    .subscribe(() => {
      if (this.playing.getValue()) {
        this.store.dispatch(new NextFrame());
      }
    });
  }


  onChange(change: MatSliderChange) {
    const keyframeIndex = change.value;
    if (keyframeIndex != null) {
      this.store.dispatch(new UpdateKeyframeIndex(keyframeIndex));
    }
  }

  play() {
    this.store.dispatch(new InterpolateChange(0));
    this.store.dispatch(new PastChange(0));
    this.playing.next(!this.playing.getValue());
  }

  forward(frames: number) {
    this.store.dispatch(new NextFrame(frames));
  }

  private async drawEntity(entity: Entity, actions: EntityAction[], pos: AbsolutePosition|null,
                           offset = 0) {
    if (!pos) {
      return;
    }
    const {svg, cached} = await this.iconService.getIcon(entity, offset);
    if (!svg) {
      return;
    }
    svg.left = pos.posX;
    svg.top = pos.posY;
    if (entity.type === EntityType.PLAYER) {
      svg.scale(pos.posZ / 5);
    }
    const action = actionForKeyframe(entity, actions, this.keyframeIndex - offset);
    if (action) {
      const size = this.getSize(action, this.keyframeIndex - offset);
      // The volleyball behaves weirdly, so treat it special.
      if (entity.type === EntityType.VOLLEYBALL) {
        svg.scale(size / 72 / 8);
      }
      const percent = percentOfAction(entity, actions, this.keyframeIndex - offset) || 0;
      if (this.shouldRotateHelper(action)) {
        svg.rotate(`+${1080 * percent}`);
      } else {
        svg.rotate(pos.rotation);
      }
      const opacity = 1 - offset / (this.past + this.interpolate);
      svg.set({opacity});
      // var sx = svg.getBoundingRect().width / svg. ;
      // var sy = svg.getBoundingRect().height / svg.height;
      // svg.scaleToWidth(72 / sx);
      // svg.scaleToHeight(72 / sy);
      // svg.scale(.1);
    }
    if (entity.id === this.selectedEntityId) {
      svg.getObjects().forEach(object => { object.set({strokeWidth : 8, stroke : 'yellow'}); });
      this.canvas.setActiveObject(svg);
    } else {
      svg.getObjects().forEach(object => { object.set({strokeWidth : 1, stroke : 'black'}); });
    }
    this.canvas.add(svg);
  }

  private shouldRotateHelper(action: EntityAction|undefined) {
    if (!action) {
      return false;
    }
    return action.type === BallActions.SPIKE || action.type === BallActions.BUMP;
  }

  private getSize(action: EntityAction, keyframe: number): number {
    if (action && (action.type === BallActions.SET || action.type === BallActions.BUMP ||
                   action.type === PlayerActions.JUMP)) {
      const percent = percentOfActionHelper(action, keyframe);
      if (!percent) {
        return 24;
      }
      const y = -Math.pow(percent * 2 - 1, 2) + 1;
      return 24 + 48 * y;
    }
    return 24;
  }

  ngAfterViewInit() {
    const canvasId = this.drillId || 'c';
    this.canvas = new fabric.Canvas(canvasId, {
      backgroundColor : 'red',
      width : COURT_SIZE / 2 + COURT_BORDER * 2,
      height : COURT_SIZE + COURT_BORDER * 2,
      fireRightClick : true,
      stopContextMenu : true
    });
    this.resetCanvas();
    this.canvas.setBackgroundColor('sandybrown');
    this.canvas.on('drop', (event) => {
      if (event.target && event.target.dropHandler) {
        console.log('dropped on object,', event.target, 'so not dealing with it here');
      } else {
        const type = event.e.dataTransfer.getData('type');
        const icon = event.e.dataTransfer.getData('icon');
        if (Object.values(EntityType).includes(type)) {
          const pos: AnimationEnd = {
            type : 'POSITION',
            endPos : {posX : event.e.offsetX, posY : event.e.offsetY},
          };
          this.store.dispatch(new AddEntity({type : type as EntityType, icon}, pos));
        } else {
          console.error('Drag event with invalid type: ' + type);
        }
      }
    });
    this.canvas.on('mouse:dblclick', event => {
      if (event.target && event.target.dropHandler) {
        const id = this.iconService.entityIdForSvg(event.target);
        console.log(id);
        if (id !== undefined) {
          const parts = id.split('-');
          const {entityId,
                 offset} = {entityId : parseInt(parts[0], 10), offset : parseInt(parts[1], 10)};
          this.store.dispatch(new SelectEntity(entityId, offset));
        }
      } else {
        // This means we clicked on the canvas
        this.store.dispatch(new AddEntity({type: EntityType.PLAYER, icon: 'player_white'}, {
          type: 'POSITION',
          endPos: {
            posX: event.e.offsetX,
            posY: event.e.offsetY,
          }
        }));
      }
    });
    this.canvas.on('mouse:down', event => {
      if (event.button === 3) { // Right-click.
        if (event.target && event.target.dropHandler) {
          console.log('dropped on object, so not dealing with it here');
          return;
        }
        if (this.selectedEntityId !== undefined) {
          this.store.dispatch(new AddAction(
              {type : 'POSITION', endPos : {posX : event.e.offsetX, posY : event.e.offsetY}}));
        }
      } else if (event.button === 1) {
        // Left-click;
        // TODO make this work.
        // this.store.dispatch(new SelectEntity(undefined));
        // this.canvas.discardActiveObject();
        // this.canvas.renderAll();
      }
    });
    setTimeout(() => this.cd.markForCheck(), 100);
    this.iconService.getIcons().subscribe(icons => {
      if (icons.size === 0) {
        return;
      }
      this.store.select(getDrawState).subscribe(({entities, interpolate, actions, past}) => {
        this.resetCanvas();
        const allEntityIds = new Set<string>();
        this.canvas.setBackgroundColor('sandybrown');
        entities.forEach((entity, idx) => {
          for (let i = 1; i <= past; i++) {
            this.drawEntity(entity, actions, this.getPos(entities, entity, actions, i), i);
            allEntityIds.add(getId(entity, i));
          }
          for (let i = 0; i < interpolate; i++) {
            this.drawEntity(entity, actions, this.getPos(entities, entity, actions, -i), -i);
            allEntityIds.add(getId(entity, -i));
          }
          this.drawEntity(entity, actions, this.getPos(entities, entity, actions));
          allEntityIds.add(getId(entity, 0));
        });
        this.canvas.renderAll();
      });
    });
  }

  private resetCanvas() {
    this.canvas.clear();
    // Boundary lines
    this.canvas.add(new fabric.Rect({
      width : COURT_SIZE / 2,
      height : COURT_SIZE,
      left : COURT_BORDER,
      top : COURT_BORDER,
      stroke : 'black',
      fill : '',
      lockMovementX : true,
      lockMovementY : true,
      lockRotation : true,
      lockScalingX : true,
      lockScalingY : true,
      selectable: false,
    }));
    // Net line
    this.canvas.add(new fabric.Line(
        [
          COURT_BORDER, COURT_SIZE / 2 + COURT_BORDER, COURT_BORDER + COURT_SIZE / 2,
          COURT_SIZE / 2 + COURT_BORDER
        ],
        {
          strokeDashArray : [ 5, 3 ],
          stroke : 'black',
          lockMovementX : true,
          lockMovementY : true,
          lockRotation : true,
          lockScalingX : true,
          lockScalingY : true,
          selectable: false,
        }));
  }

  getPos(entities: Entity[], entity: Entity, actions: EntityAction[], minus = 0): AbsolutePosition
      |null {
    if (this.keyframeIndex >= minus) {
      const pos = this.animationService.positionForKeyframe(entity, this.keyframeIndex - minus);
      if (!pos) {
        return null;
      }
      if (pos.posX === 0 && pos.posY === 0) {
        return null;
      }
      return pos;
    }
    return null;
  }

  @HostListener('dragover', [ '$event' ])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  trackByIdx(index: number): number { return index; }

  slow() {
    this.store.dispatch(new SpeedChange(Math.min(this.speed * 2, 500)));
  }

  fast() {
    this.store.dispatch(new SpeedChange(this.speed / 2));
  }

  onSpeedChange(change: MatSliderChange) {
    if (change.value == null) {
      throw new Error('Speed change event value was null');
    }
    this.store.dispatch(new SpeedChange(change.value));
  }

  async export() {
    const gif = new (window as any).GIF({workers : 10, quality : 10});

    const canvas = document.querySelector('canvas');
    if (!canvas) {
      throw new Error('Unable to find canvas');
    }

    let length = 0;
    this.store.select(maxAnimationLength).subscribe(val => { length = val; });
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to get context');
    }
    for (let i = 0; i < length; i++) {
      gif.addFrame(context.getImageData(0, 0, 800, 800), {delay : 30});
      this.store.dispatch(new NextFrame());
      await delay(10);
    }

    setTimeout(() => {
      // gif.addFrame(canvas.getContext('2d'), { delay: 2000 });
      // or copy the pixels from a canvas context

      gif.on('finished', function(blob) { window.open(URL.createObjectURL(blob)); });

      gif.render();
    }, 10);
  }
}
async function delay(milliseconds: number) {
  return new Promise<void>(resolve => { setTimeout(resolve, milliseconds); });
}
