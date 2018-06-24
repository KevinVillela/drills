import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Drill, FOCUSES, ENVIRONMENTS, LEVELS, PHASES } from '../app/model/types';

export type DrillsFilter = Partial<Drill>;

@Component({
  selector: 'drills-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Output() filterChange = new EventEmitter<DrillsFilter>();

  readonly focuses = FOCUSES;
  readonly environments = ENVIRONMENTS;
  readonly levels = LEVELS;
  readonly phases = PHASES;
    /** The object to filter by. */
    filter: Partial<Drill> = {
      environment: [],
      focus: [],
    };

  constructor() { }

  ngOnInit() {
  }

}
