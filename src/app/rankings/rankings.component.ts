import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, of} from 'rxjs';
import {Observable} from 'rxjs/Observable';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';

import {StatusAnd} from '../model/status_and';

import {Gender, RankingsService, Team} from './rankings.service';

@Component({
  selector : 'drills-rankings',
  templateUrl : './rankings.component.html',
  styleUrls : [ './rankings.component.css' ]
})
export class RankingsComponent implements OnInit {

  readonly rankings: Observable<StatusAnd<Team[], string>>;
  readonly displayedColumns: string[] = [ 'position', 'name', 'points', 'country' ];
  readonly years = [ 2020, 2016, 2012, 2008, 2004, 2000 ];
  yearChange = new BehaviorSubject<number>(2016);
  genderChange = new BehaviorSubject<Gender>('M');
  countryChange = new BehaviorSubject<'USA'|'All'>('All');
  constructor(private readonly rankingsService: RankingsService) {
    const rankingsCall = combineLatest(this.yearChange, this.genderChange).pipe(
      switchMap(([year, gender]) => this.rankingsService.getPlayers(year, gender)));
    this.rankings = combineLatest(rankingsCall, this.countryChange)
                        .pipe(map(
                            ([ resp, country ]) => {
                              if (!resp.result) {
                                return resp;
                              }
                              return {
                                ...resp,
                                result : resp.result.filter((team) => country === 'All' ||
                                                                      team.country === country),
                              };
                            },
                            ));
  }

  ngOnInit() {}
}
