import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Pipe,
  PipeTransform,
  Input
} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {first, map} from 'rxjs/operators';

import {DatabaseService} from '../../database.service';
import {DrillsFilter} from '../../filter/filter.component';
import {LoadAnimation} from '../model/model';
import {
  Drill,
  DrillsState,
  DrillWithId,
  Environment,
  ENVIRONMENTS,
  FOCUSES,
  LEVELS,
  PHASES
} from '../model/types';
import { AuthService } from '../../core/auth/auth.service';
import { EventEmitter } from 'protractor';
import { MatSnackBar } from '../../../node_modules/@angular/material';

@Component({
  selector : 'drills-home',
  templateUrl : './home.component.html',
  styleUrls : [ './home.component.scss' ],
  changeDetection : ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  /** If true, allow selection of the drills. */
  @Input() selectable = false;
  /** A map from Drill ID to whether it was selected or not. */
  readonly selected = new Map<string, boolean>();

  drills: Observable<DrillWithId[]>;
  readonly focuses = FOCUSES;
  readonly environments = ENVIRONMENTS;

  readonly Environment = Environment;
  /** The object to filter by. */
  filter: DrillsFilter = {
    environment : [],
    focus: [],
  };

  constructor(private readonly databaseService: DatabaseService,
              private readonly cd: ChangeDetectorRef,
            private readonly authService: AuthService,
          private readonly snackBar: MatSnackBar) {
    this.drills = this.databaseService.drills;
  }

  ngOnInit() { this.drills.subscribe((drills) => console.log(drills)); }

  getBeachColor() {
    if (!this.filter.environment || !this.filter.environment.length ||
        this.filter.environment.includes(Environment.BEACH)) {
      return 'orange';
    }
    return 'grey';
  }

  getCourtColor() {
    if (!this.filter.environment || !this.filter.environment.length ||
        this.filter.environment.includes(Environment.COURT)) {
      return 'brown';
    }
    return 'grey';
  }

  getStarIcon() {
    if (this.filter.starred === undefined) {
      return 'bookmark_border';
    } else if (this.filter.starred === true) {
      return 'bookmark';
    } else if (this.filter.starred === false) {
      return 'bookmark';
    }
  }

  getStarColor() {
    if (this.filter.starred === undefined) {
      return 'grey';
    } else if (this.filter.starred === true) {
      return '#fdd835';
    } else {
      return 'red';
    }
  }

  toggleStar() {
    if (!this.authService.getUserSync()) {
      this.snackBar.open('Please log-in to filter by favorites.', '', {duration: 1000});
      return;
    }
    if (this.filter.starred === undefined) {
      this.filter.starred = true;
    } else if (this.filter.starred === true) {
      this.filter.starred = false;
    } else if (this.filter.starred === false) {
      this.filter.starred = undefined;
    }
  }

  toggleEnv(environment: Environment) {
    if (!this.filter.environment) {
      this.filter.environment = [ environment ];
    } else if (this.filter.environment.includes(environment)) {
      this.filter.environment = this.filter.environment.filter((env) => env !== environment);
    } else {
      this.filter.environment.push(environment);
    }
  }

  getVerifiedColor() {
    if (this.filter.verified === undefined) {
      return 'grey';
    } else if (this.filter.verified === true) {
      return 'green';
    } else {
      return 'red';
    }
  }

  toggleVerified() {
    if (this.filter.verified === undefined) {
      return this.filter.verified = true;
    } else if (this.filter.verified === true) {
      return this.filter.verified = false;
    } else {
      return this.filter.verified = undefined;
    }
  }
}
