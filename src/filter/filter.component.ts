import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { Drill, FOCUSES, ENVIRONMENTS, LEVELS, PHASES, Environment } from '../app/model/types';

export type DrillsFilter = Partial<Drill>;

@Component({
  selector: 'drills-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {

  @Output() filterChange = new EventEmitter<DrillsFilter>();

    /** The object to filter by. */
 @Input() filter: DrillsFilter = {
    environment: [],
    focus: [],
  };

  readonly focuses = FOCUSES;
  readonly environments = ENVIRONMENTS;
  readonly levels = LEVELS;
  readonly phases = PHASES;

  constructor() { }

  ngOnInit() {
  }

}
