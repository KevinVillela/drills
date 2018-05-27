import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EntityType } from '../model/types';

@Component({
  selector: 'drills-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendComponent implements OnInit {

  readonly EntityType = EntityType;
  constructor() { }

  ngOnInit() {
  }

  onDragStart(event: DragEvent, type: EntityType, icon: string): void {
    console.log(event);
    event.dataTransfer.setData('type', type);
    event.dataTransfer.setData('icon', icon);
  }

  onDragEnd(event: DragEvent, type: EntityType): void {
    console.log('dragend');
    console.info(event.dataTransfer.dropEffect);
  }
}
