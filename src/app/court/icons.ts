import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {fabric} from 'fabric';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {bindCallback} from 'rxjs/observable/bindCallback';
import {zip} from 'rxjs/observable/zip';
import {combineLatest, map, mapTo, merge, mergeMap, tap, withLatestFrom} from 'rxjs/operators';

import {
  AddAction,
  AddEntity,
  DeleteAction,
  DeleteEntity,
  getCurrentAction,
  getId,
  getSelectedEntityId,
  PossessSelected,
  SelectEntity,
  SetPosition,
  SetRotation
} from '../model/model';
import {AnimationEnd, DrillsState, Entity, EntityAction, EntityType} from '../model/types';

import {COURT_SIZE} from './court.component';

@Injectable()
export class IconService {
  private readonly iconMap = new BehaviorSubject<Map<string, fabric.Path>>(new Map());
  private readonly entityIconMap = new Map<string, fabric.Path>();
  private currentAction?: EntityAction;
  private selectedEntityId?: number;

  constructor(private readonly store: Store<{drillsState: DrillsState}>) {
    this.store.select(getSelectedEntityId).subscribe((val) => { this.selectedEntityId = val; });
    this.store.select(getCurrentAction).subscribe((val) => { this.currentAction = val; });
    const callbacks =
        [ 'volleyball', 'player_white', 'player_blue', 'player_yellow', 'player_green', 'cone_orange' ].map(
            (url) => {
              return (bindCallback(fabric.loadSVGFromURL) as any)(`assets/${url}.svg`)
                  .pipe(map(([ objects, options ]) => {
                    const svg = fabric.util.groupSVGElements(objects, options);
                    svg.scaleToWidth(24);
                    svg.scaleToHeight(24);
                    return {url, svg};
                  }));
            });
    zip(...callbacks).subscribe((assets: {url: string, svg: string}[]) => {
      const tempMap = new Map<string, fabric.Path>();
      assets.forEach((asset) => { tempMap.set(asset.url, asset.svg); });
      this.iconMap.next(tempMap);
    });
  }

  getIcons() { return this.iconMap.asObservable(); }

  entityIdForSvg(svg: fabric.Path): string|undefined {
    let ret: string|undefined;
    this.entityIconMap.forEach((icon, id) => {
      if (icon === svg) {
        ret = id;
      }
    });
    return ret;
  }

  getIcon(entity: Entity, offset: number): Promise<{svg: fabric.Path, cached: boolean}> {
    const id = getId(entity, offset);
    const icon = this.entityIconMap.get(id);
    if (icon) {
      return Promise.resolve({svg : icon, cached : true});
    }
    const newIcon = this.iconMap.getValue().get(entity.icon);
    if (!newIcon) {
      throw new Error(`Could not find icon for ${entity.icon}`);
    }
    const promise = new Promise<{svg: fabric.Path, cached: boolean}>((resolve) => {
      newIcon.clone((res) => {
        res.dropHandler = true;
        res.lockUniScaling = true;
        res.lockScalingX = true;
        res.lockScalingY = true;
        res.stroke = 'white';
        res.strokeWidth = 50;
        res.originX = 'center';
        res.originY = 'center';
        res.onSelect = () => { this.store.dispatch(new SelectEntity(entity.id)); };
        res.onSelect = () => { this.store.dispatch(new SelectEntity(entity.id)); };
        res.on('drop', (event) => {
          const type = event.e.dataTransfer.getData('type');
          const iconData = event.e.dataTransfer.getData('icon');
          if (Object.values(EntityType).includes(type)) {
            const pos: AnimationEnd = {
              type : 'ENTITY',
              entityId : entity.id,
            };
            this.store.dispatch(new AddEntity(
                {type : type as EntityType, icon : iconData}, pos, entity.id));
          } else {
            console.error('Drag event with invalid type: ' + type);
          }
        });
        res.on('moving', (event) => {
          // const posX = event.target.left;
          // const posY = event.target.top;
          const posX = event.e.offsetX;
          const posY = event.e.offsetY;
          // TODO don't hardcode this. Right now it causes a circular dep.
          if (posX > 350 || posY > 500) {
            this.store.dispatch(new DeleteEntity(entity.id));
          } else {
            this.store.dispatch(new SetPosition(entity.id, offset, {posX, posY}));
          }
        });
        res.on('rotating', (event) => {
          console.log(event);
          this.store.dispatch(new SetRotation(entity.id, Math.floor(res.angle)));
        });
        res.on('mousedown', (event) => {
          if (event.button === 3) { // Right-click.
            console.log('right down!');
            if (this.selectedEntityId == null || this.selectedEntityId === entity.id) {
              this.store.dispatch(
                new AddAction({type : 'POSITION', endPos : {posX : event.e.offsetX, posY : event.e.offsetY}}, entity.id));
            } else {
              this.store.dispatch(
                  new AddAction({type : 'ENTITY', entityId : entity.id}, entity.id));
            }
          }
        });
        this.entityIconMap.set(id, res);
        resolve({svg : res, cached : false});
      });
    });
    return promise;
  }

  getIconsToDelete(used: Set<string>): fabric.Path[] {
    const ret: fabric.Path[] = [];
    this.entityIconMap.forEach((icon, id) => {
      if (!used.has(id)) {
        this.entityIconMap.delete(id);
        ret.push(icon);
      }
    });
    return ret;
  }
}
