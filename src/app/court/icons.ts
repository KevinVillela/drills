import { bindCallback } from 'rxjs/observable/bindCallback';
import { zip } from 'rxjs/observable/zip';
import { tap, combineLatest, map, merge, withLatestFrom, mergeMap, mapTo } from 'rxjs/operators';

import { fabric } from 'fabric';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Entity, SelectEntity, DrillsState, SetPosition, getSelectedEntityId, DeleteEntity, getId } from '../model/model';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()
export class IconService {

    private readonly iconMap = new BehaviorSubject<Map<string, fabric.Path>>(new Map());
    private readonly entityIconMap = new Map<string, fabric.Path>();

    constructor(private readonly store: Store<{ drillsState: DrillsState }>) {
        const callbacks = ['volleyball', 'player_white', 'player_blue', 'player_yellow', 'player_green'].map((url) => {
            return (bindCallback(fabric.loadSVGFromURL) as any)(`assets/${url}.svg`).pipe(map(([objects, options]) => {
                const svg = fabric.util.groupSVGElements(objects, options);
                svg.scaleToWidth(24);
                svg.scaleToHeight(24);
                return { url, svg };
            }));
        });
        zip(...callbacks).subscribe((assets: { url: string, svg: string }[]) => {
            const tempMap = new Map<string, fabric.Path>();
            assets.forEach((asset) => {
                tempMap.set(asset.url, asset.svg);
            });
            this.iconMap.next(tempMap);
        });
    }

    getIcons() {
        return this.iconMap.asObservable();
    }

    entityIdForSvg(svg: fabric.Path): string | undefined {
        let ret: string | undefined;
        this.entityIconMap.forEach((icon, id) => {
            if (icon === svg) {
                ret = id;
            }
        });
        return ret;
    }

    getIcon(entity: Entity, offset: number): Promise<{ svg: fabric.Path, cached: boolean }> {
        const id = getId(entity, offset);
        const icon = this.entityIconMap.get(id);
        if (icon) {
            return Promise.resolve({ svg: icon, cached: true });
        }
        const newIcon = this.iconMap.getValue().get(entity.icon);
        if (!newIcon) {
            throw new Error(`Could not find icon for ${entity.icon}`);
        }
        const promise = new Promise<{ svg: fabric.Path, cached: boolean }>((resolve) => {
            newIcon.clone((res) => {
                res.lockUniScaling = true;
                res.lockScalingX = true;
                res.lockScalingY = true;
                res.stroke = 'white';
                res.strokeWidth = 50;
                res.originX = 'center';
                res.originY = 'center';
                res.onSelect = () => {
                    this.store.dispatch(new SelectEntity(entity.id));
                };
                res.onSelect = () => {
                    this.store.dispatch(new SelectEntity(entity.id));
                };
                res.on('moving', (event) => {
                    // const posX = event.target.left;
                    // const posY = event.target.top;
                    const posX = event.e.offsetX;
                    const posY = event.e.offsetY;
                    console.log(event.e);
                    // TODO don't hard code the height and width of the court.
                    if (posX > 400 || posY > 400) {
                        this.store.dispatch(new DeleteEntity(entity.id));
                    } else {
                        this.store.dispatch(new SetPosition(entity.id, offset, { posX, posY }));
                    }
                });
                this.entityIconMap.set(id, res);
                resolve({ svg: res, cached: false });
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
