import {Component, OnInit, PipeTransform, Pipe, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {first, map} from 'rxjs/operators';

import {DrillsState, Environment, FOCUSES, ENVIRONMENTS, Drill, PHASES, LEVELS, DrillWithId} from '../model/types';
import { Store } from '@ngrx/store';
import { LoadAnimation } from '../model/model';
import { DrillsFilter } from '../../filter/filter.component';
import { DatabaseService } from '../../database.service';

@Component({
  selector : 'drills-home',
  templateUrl : './home.component.html',
  styleUrls : [ './home.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  drills: Observable<DrillWithId[]>;
  readonly focuses = FOCUSES;
  readonly environments = ENVIRONMENTS;
  readonly levels = LEVELS;
  readonly phases = PHASES;

  /** The object to filter by. */
  filter: DrillsFilter = {
    environment: [],
    focus: [],
  };

  constructor(private readonly databaseService: DatabaseService, private readonly cd: ChangeDetectorRef) {
    this.drills = this.databaseService.drills;
  }

  ngOnInit() {
    this.drills.subscribe((drills) => console.log(drills));
    /* this.drills.subscribe((snapshot) => {
       snapshot.forEach((drill) => {
         this.db.doc(`drills/${drill.id}`).update({...drill, environment: [Environment.BEACH]});
       });
     }); */
  }
}
