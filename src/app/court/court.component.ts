import { Component, OnInit, HostListener, Input, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Entity, EntityType, Position, AddEntity, AddAction, DrillsState, DeleteEntity, SetPosition, positionForKeyFrame, BallActions, currentEntity, NextFrame, SelectEntity, maxAnimationLength, actionForKeyframe, percentOfAction, EntityAction, percentOfActionHelper, getSelectedEntityId, getId, getDrawState } from '../model/model';
import { ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap, combineLatest, map, merge, withLatestFrom, mergeMap, mapTo } from 'rxjs/operators';
import { MatInputBase } from '@angular/material';
import { fabric } from 'fabric';
import { IconService } from './icons';
import { combineLatest as combineLatestStatic } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'drills-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourtComponent implements OnInit, AfterViewInit {
  currentEntity: Entity | undefined;
  interpolate: number;
  past: number;
  entities: Observable<Entity[]>;
  keyframeIndex = 0;
  canvas: fabric.Canvas;
  private selectedEntityId: number | undefined = undefined;
  /** A map from entity-offset combo to if it is animating or not. */
  private readonly isAnimating = new Map<string, boolean>();

  constructor(private readonly el: ElementRef,
    private readonly store: Store<{ drillsState: DrillsState }>,
    private readonly cd: ChangeDetectorRef,
    private readonly iconService: IconService) { }

  ngOnInit() {
    this.cd.markForCheck();
    this.store.select((state) => state.drillsState.keyframeIndex).subscribe((val) => {
      this.keyframeIndex = val;
      this.cd.detectChanges();
    });
    this.entities = this.store.select((state) => state.drillsState.entities);
    this.store.select((state) => state.drillsState.interpolate).subscribe((val) => {
      this.interpolate = val;
    });
    this.store.select((state) => state.drillsState.past).subscribe((val) => {
      this.past = val;
    });
    this.store.select(getSelectedEntityId).subscribe((val) => {
      this.selectedEntityId = val;
    });
    this.store.select(currentEntity).subscribe((entity) => {
      this.currentEntity = entity;
    });
  }

  private async drawEntity(entity: Entity, actions: EntityAction[], pos: Position | null, offset = 0) {
    if (!pos) {
      return;
    }
    const { svg, cached } = await this.iconService.getIcon(entity, offset);
    if (!svg) {
      return;
    }
    svg.left = pos.posX;
    svg.top = pos.posY;
    const action = actionForKeyframe(entity, actions, this.keyframeIndex - offset);
    if (action && entity.type === 'volleyball') {
      const size = this.getSize(action, this.keyframeIndex - offset);
      // console.log(size);
      svg.scale((size / 72) / 5);
      const percent = (percentOfAction(entity, actions, this.keyframeIndex - offset) || 0);
      if (this.shouldRotateHelper(action)) {
        svg.rotate(`+${1080 * percent}`);
        // this.rotate(entity, offset, svg);
      } else {
        svg.rotate('0');
      }
      const opacity = 1 - offset / (this.past + this.interpolate);
      svg.set({
        opacity
      });
      // var sx = svg.getBoundingRect().width / svg. ;
      // var sy = svg.getBoundingRect().height / svg.height;
      // svg.scaleToWidth(72 / sx);
      // svg.scaleToHeight(72 / sy);
      // svg.scale(.1);
    }
    if (entity.id === this.selectedEntityId) {
      svg.getObjects().forEach((object) => {
        object.set({
          strokeWidth: 8,
          stroke: 'yellow'
        });
      });
      this.canvas.setActiveObject(svg);
    } else {
      svg.getObjects().forEach((object) => {
        object.set({
          strokeWidth: 1,
          stroke: 'black'
        });
      });
    }
    // if (!cached) {
    this.canvas.add(svg);
    // }
  }

  private rotate(entity: Entity, actions: EntityAction[], offset: number, svg: fabric.Path): void {
    const id = getId(entity, offset);
    if (this.isAnimating.get(id)) {
      return;
    }
    this.isAnimating.set(id, true);
    svg.animate({ angle: '-=360' }, {
      duration: Infinity,
      onChange: () => this.canvas.renderAll(),
      onComplete: () => {
        this.isAnimating.set(id, false);
      },
      easing: (t) => t,
      // easing: function (t, b, c, d) { return c * t / d + b },
      abort: () => {
        return !this.shouldRotate(entity, actions, offset);
      }
    });
  }

  private shouldRotate(entity: Entity, actions: EntityAction[], offset: number): boolean {
    const action = actionForKeyframe(entity, actions, this.keyframeIndex - offset);
    return this.shouldRotateHelper(action);
  }

  private shouldRotateHelper(action: EntityAction | undefined) {
    if (!action) {
      return false;
    }
    return (action.type === 'spike' || action.type === 'bump');
  }

  private getSize(action: EntityAction, keyframe: number): number {
    if (action && (action.type === 'set' || action.type === 'bump')) {
      const percent = percentOfActionHelper(action, keyframe);
      if (!percent) {
        return 24;
      }
      const y = -Math.pow((percent * 2 - 1), 2) + 1;
      return 24 + (48 * y);
    }
    return 24;
  }

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas('c', { backgroundColor: 'red', width: 400, height: 400, fireRightClick: true, stopContextMenu: true });
    // this.canvas.setBackgroundColor('red', this.canvas.renderAll.bind(this.canvas));
    this.canvas.setBackgroundColor('sandybrown');
    this.canvas.on('mouse:dblclick', (event) => {
      if (event.target) {
        const id = this.iconService.entityIdForSvg(event.target);
        console.log(id);
        if (id !== undefined) {
          const parts = id.split('-');
          const { entityId, offset } = { entityId: parseInt(parts[0], 10), offset: parseInt(parts[1], 10) };
          this.store.dispatch(new SelectEntity(entityId, offset));
        }
      }
    });
    this.canvas.on('mouse:down', (event) => {
      if (event.button === 3) {
        // Right-click.
        if (this.selectedEntityId !== undefined) {
          this.store.dispatch(new AddAction(this.selectedEntityId, { posX: event.e.offsetX, posY: event.e.offsetY }));
        }
      } else if (event.button === 1) {
        // Left-click;
        // TODO make this work.
        // this.store.dispatch(new SelectEntity(undefined));
        // this.canvas.discardActiveObject();
        // this.canvas.renderAll();
      }
    });
    fabric.util.addListener(document.getElementById('c')!, 'contextmenu', function (e) {
      console.log('hi');
      e.preventDefault();
    });
    document.getElementById('c')!.addEventListener('contextmenu', function (e) {
      console.log('hi');
      e.preventDefault();
    });
    // this.canvas.renderAll();
    // this.canvas.on('touch:drag', function (options) {
    //   console.log('drop');
    //   const entityObject = options.target;
    //   if (entityObject) {
    //   }
    // });
    this.store.select(getDrawState).subscribe(() => {
      console.log('draw!');
    });
    setTimeout(() => this.cd.markForCheck(), 100);
    this.iconService.getIcons().subscribe((icons) => {
      if (icons.size === 0) {
        return;
      }
      // combineLatestStatic(
      //   this.store.select((state) => state.drillsState.entities),
      //   this.store.select((state) => state.drillsState.interpolate),
      //   this.store.select((state) => state.drillsState.past),
      //   this.store.select((state) => state.drillsState.keyframeIndex))
      this.store.select(getDrawState)
        .subscribe(({ entities, interpolate, actions, past }) => {
          this.canvas.clear();
          const allEntityIds = new Set<string>();
          this.canvas.setBackgroundColor('sandybrown');
          entities.forEach((entity, idx) => {
            for (let i = 1; i <= past; i++) {
              this.drawEntity(entity, actions, this.getPos(entity, actions, i), i);
              allEntityIds.add(getId(entity, i));
            }
            for (let i = 0; i < interpolate; i++) {
              this.drawEntity(entity, actions, this.getPos(entity, actions, -i), -i);
              allEntityIds.add(getId(entity, -i));
            }
            this.drawEntity(entity, actions, this.getPos(entity, actions));
            allEntityIds.add(getId(entity, 0));
          });
          // this.iconService.getIconsToDelete(allEntityIds).forEach((icon) => {
          //   this.canvas.remove(icon);
          // })
          this.canvas.renderAll();
        });
    });
  }

  getPos(entity: Entity, actions: EntityAction[], minus = 0): Position | null {
    if (this.keyframeIndex >= minus) {
      const pos = positionForKeyFrame(entity, actions, this.keyframeIndex - minus);
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

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    const type = event.dataTransfer.getData('type');
    const icon = event.dataTransfer.getData('icon');
    const rect = this.el.nativeElement.getBoundingClientRect();
    // if (event.offsetX === 0) {
    //   this.store.dispatch(new DeleteEntity(Number.parseInt(event.dataTransfer.getData('index'))));
    //   return;
    // }
    if (Object.values(EntityType).includes(type)) {
      // PLAYER has a PlayerActions.WAIT enum, too.
      this.store.dispatch(new AddEntity({
        start: { posX: event.offsetX, posY: event.offsetY },
        type: type as EntityType,
        icon,
      }));
    } else {
      // Do nothing, the item was probably already on the court.
    }
  }

  addPosition(index: number, position: Position): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.store.dispatch(new AddAction(index, { posX: position.posX - rect.left, posY: position.posY - rect.top }));
  }

  // setPosition(index: number, position: Position): void {
  //   const rect = this.el.nativeElement.getBoundingClientRect();
  //   this.store.dispatch(new SetPosition(index, { posX: position.posX - rect.left, posY: position.posY - rect.top }));
  // }

  trackByIdx(index: number): number {
    return index;
  }

  async export() {
    const gif = new (window as any).GIF({
      workers: 10,
      quality: 10,
    });

    const canvas = document.querySelector('canvas')!;

    let length = 0;
    this.store.select(maxAnimationLength).subscribe((val) => {
      length = val;
    });
    for (let i = 0; i < length; i++) {
      gif.addFrame(canvas.getContext('2d')!.getImageData(0, 0, 800, 800), { delay: 30 });
      this.store.dispatch(new NextFrame());
      await delay(10);
    }


    setTimeout(() => {
      // gif.addFrame(canvas.getContext('2d'), { delay: 2000 });
      // or copy the pixels from a canvas context

      gif.on('finished', function (blob) {
        window.open(URL.createObjectURL(blob));
      });

      gif.render();
    }, 10);
  }
}
async function delay(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}
