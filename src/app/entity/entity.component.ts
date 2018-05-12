import { EventEmitter, Component, OnInit, HostListener, ChangeDetectionStrategy, Input, HostBinding, Output, ViewChild } from '@angular/core';
import { Entity, Position, DrillsState, DeleteEntity, SetPosition, SelectEntity, actionForKeyframe, getCurrentAction, BallActions, getKeyframeIndex, percentOfAction } from '../model/model';
import { Subject } from 'rxjs/Subject';
import { throttle, throttleTime, timeInterval, switchMap, map, withLatestFrom } from 'rxjs/operators';
import { CourtComponent } from '../court/court.component';
import { interval } from 'rxjs/observable/interval';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { trigger, state, style, animate, keyframes, transition } from '@angular/animations';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'drills-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('signal', [
      state('void', style({
        background: 'transparent',
      })),
      // transition('* => *', animate(250, keyframes([
      //   style({
      //     background: 'red',
      //   }),
      //   style({
      //     background: 'transparent',
      //   }),
      // ])
      // ))
    ]),
  ]
})
export class EntityComponent implements OnInit {
  size: Observable<number>;
  actionClass: Observable<string>;
  signal: string | null = null;
  entity: Observable<Entity>;
  lastEntity: Observable<Entity>;
  recording: boolean;

  @Input() index: number;
  @Input() keyframeIndex: number;

  @Output() newPosition = new EventEmitter<Position>();
  @Output() setPosition = new EventEmitter<Position>();

  private drag = new BehaviorSubject<Position | null>(null);
  constructor(private readonly store: Store<{ drillsState: DrillsState }>) { }

  ngOnInit() {
    this.entity = this.store.select((state) => state.drillsState).pipe((map((drillsState) => {
      return drillsState.entities[this.index];
    })));
    this.actionClass = this.entity.pipe(withLatestFrom(this.store.select(getKeyframeIndex)), map(([entity, keyframeIndex]) => {
      if (entity) {
        return actionForKeyframe(entity, keyframeIndex);
      }
      return null;
    }), map((action) => {
      if (!action) {
        return '';
      }
      switch (action.type) {
        case BallActions.SPIKE:
          return 'spin';
        case BallActions.SET:
          return 'set';
        case BallActions.BUMP:
          return 'bump';
        default:
          return '';
      }
    }));
    this.size = this.entity.pipe(withLatestFrom(this.actionClass), map(([entity, actionClass]) => {
      if (actionClass === 'set' || actionClass === 'bump') {
        const percent = percentOfAction(entity, this.keyframeIndex);
        if (!percent) {
          return 24;
        }
        const y = -Math.pow((percent * 2 - 1), 2) + 1;
        return 24 + (24 * y);
      }
      return 24;
    }));
    this.store.select((state) => state.drillsState.speed).pipe(switchMap((period) => interval(period))).subscribe(() => {
      const pos = this.drag.getValue();
      if (pos != null) {
        this.newPosition.emit(pos);
        // if (this.signal === 'record') {
        //   this.signal = 'record2';
        // } else {
        //   this.signal = 'record';
        // }
      }
    });
  }

  deleteEntity() {
    this.store.dispatch(new DeleteEntity(this.index));
  }

  selectEntity() {
    this.store.dispatch(new SelectEntity(this.index));
  }

  // Enable/disable HTML5 DnD API on the element.
  @HostBinding('draggable')
  get draggable() {
    return true;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    console.log(event);
    event.dataTransfer.setData('index', this.index.toString());
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    if (!this.recording) {
      this.newPosition.next({ posX: event.clientX, posY: event.clientY });
    }
    this.drag.next(null);
  }

  @HostListener('drag', ['$event'])
  onDrag(event: DragEvent) {
    if (this.recording) {
      this.drag.next({ posX: event.clientX, posY: event.clientY });
    }
    event.stopPropagation();
  }
}
