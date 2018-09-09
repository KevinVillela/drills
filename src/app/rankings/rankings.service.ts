import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {bindCallback, throwError, of} from 'rxjs';
import {Observable} from 'rxjs/Observable';
import {map, mergeMap, scan, switchMap} from 'rxjs/operators';
import * as xml2js from 'xml2js';

import {Status, StatusAnd, wrap} from '../model/status_and';

export interface Team {
  name: string;
  points: number;
  position: number;
  country: string;
}

declare interface VolleyballTournament {
  code: string;
  endDate: string;
  name: string;
  startDate: string;
  no: number;
}

declare interface VolleyballTournaments {
  data: VolleyballTournament[];
}

declare interface VolleyballTournamentRanking {
  rank: number;
  teamCode: string;
  no: number;
  teamName: string;
}

declare interface VolleyballTournamentRankings {
  data: VolleyballTournamentRanking[];
}

declare interface BeachOlympicSelectionRankingEntryFields {
  GamesYear: number;
  TeamName: string;
  TeamCountryCode: string;
  Position: number;
  Points: number;
}

declare interface BeachOlympicSelectionRankingEntry {
  $: BeachOlympicSelectionRankingEntryFields;
}

declare interface BeachOlympicSelectionRanking {
  BeachOlympicSelectionRankingEntry?: BeachOlympicSelectionRankingEntry[];
}

declare interface BeachOlympicSelectionRankingResponse {
  BeachOlympicSelectionRanking: BeachOlympicSelectionRanking[];
}

export type Gender = 'M'|'W';

@Injectable({providedIn : 'root'})
export class RankingsService {

  constructor(private readonly http: HttpClient) {}

  getPlayers(year: number, gender: Gender): Observable<StatusAnd<Team[], string>> {
    const request = this.xmlFromObject(
        {
          Type : 'GetBeachOlympicSelectionRanking',
          GamesYear : year,
          Gender : gender,
          Fields : 'GamesYear TeamName TeamCountryCode Position Points',
        },
        true,
    );
    return this.makeRequest<BeachOlympicSelectionRankingResponse>(request).pipe(
        switchMap((resp) => {
      const entries = resp.BeachOlympicSelectionRanking[0].BeachOlympicSelectionRankingEntry;
      if (!entries) {
        if (year === 2020) {
          return throwError(
              'The FIVB does not have rankings for this year... Yet! The first ranked tournament should start on September 21st, please check back then!',
          );
        }
        return throwError('The FIVB does not have rankings for this year.');
      }
      return of(entries.map((ranking) => ({
                           name : ranking.$.TeamName,
                           country : ranking.$.TeamCountryCode,
                           position : ranking.$.Position,
                           points : ranking.$.Points,
                         })));
                        }),
                      (obs) => wrap<Team[], string>(obs));
  }

  private makeRequest<T>(request: {}): Observable<T> {
    return this.http
        .post('https://www.fivb.org/Vis2009/XmlRequest.asmx', request, {
          headers :
              {'Content-Type' : 'application/x-www-form-urlencoded', 'Accept' : 'application/xml'},
          responseType : 'text',
        })
        .pipe(switchMap((xmlResp) => {
                return bindCallback<string, {Responses: T}>((xml2js.parseString))(xmlResp);
              }),
              map(([ err, resp ]) => {
                return resp.Responses;
              }));
  }

  private xmlFromObject(obj: {}, newFormat = false, filter?: {}): string {
    if (filter) {
      return new xml2js.Builder().buildObject(
          {Requests : {Request : {$ : obj, Filter : {$ : filter}}}});
    }
    return new xml2js.Builder().buildObject({Requests : {Request : {$ : obj}}});
  }
}

const test = `<Requests><Request Type="GetBeachOlympicSelectionRanking"
GamesYear="2016"
Gender="M"
ReferenceDate="2014-01-01"
Fields="Position TeamName TeamCountryCode NbParticipations SelectionRank Points Status" /></Requests>`;
