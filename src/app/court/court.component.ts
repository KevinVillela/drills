import { Component, OnInit, HostListener, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Entity, EntityType, Position, AddEntity, AddAction, DrillsState, DeleteEntity, SetPosition, positionForKeyFrame, BallActions, currentEntity } from '../model/model';
import { ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { MatInputBase } from '@angular/material';

@Component({
  selector: 'drills-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourtComponent implements OnInit {
  currentEntity: Observable<Entity | undefined>;
  interpolate: number;
  past: number;
  entities: Observable<Entity[]>;
  keyframeIndex = 0;
  constructor(private readonly el: ElementRef, private readonly store: Store<{ drillsState: DrillsState }>, private readonly cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.currentEntity = this.store.select(currentEntity);
    this.cd.markForCheck();
    this.store.select((state) => state.drillsState.keyframeIndex).subscribe((val) => {
      this.keyframeIndex = val;
      this.cd.detectChanges();
    })
    this.entities = this.store.select((state) => state.drillsState.entities);
    this.store.select((state) => state.drillsState.interpolate).subscribe((val) => {
      this.interpolate = val;
    })
    this.store.select((state) => state.drillsState.past).subscribe((val) => {
      this.past = val;
    })
  }

  ngAfterViewInit() {
    setTimeout(() => this.cd.markForCheck(), 100);
  }

  getPos(entity: Entity, minus = 0): Position | null {
    if (this.keyframeIndex >= minus) {
      const pos = positionForKeyFrame(entity, this.keyframeIndex - minus);
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
        actions: [],
        type: type as EntityType,
        icon,
      }));
    }
    else {
      // Do nothing, the item was probably already on the court.
    }
  }

  addPosition(index: number, position: Position): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.store.dispatch(new AddAction(index, { posX: position.posX - rect.left, posY: position.posY - rect.top }));
  }

  setPosition(index: number, position: Position): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.store.dispatch(new SetPosition(index, { posX: position.posX - rect.left, posY: position.posY - rect.top }));
  }

  trackByIdx(index: number): number {
    return index;
  }
}
