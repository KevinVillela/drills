import {Pipe, PipeTransform} from '@angular/core';
import {Drill, DrillFocus, DrillWithId} from '../app/model/types';
import {DrillsFilter} from './filter.component';
import { AuthService } from '../core/auth/auth.service';
import * as fuzzy from 'fuzzy';

@Pipe({
  name : 'search',
  pure : false,
})
export class SearchFilterPipe implements PipeTransform {
  constructor(private readonly authService: AuthService) {}

  transform(items: DrillWithId[]|null, filter: Drill) { return searchFilter(this.authService, items, filter); }
}

function intersects(array1: Array<{}>, array2: Array<{}>): boolean {
  return array1.filter(value => -1 !== array2.indexOf(value)).length !== 0;
}

export function searchFilter(authService: AuthService, items: DrillWithId[]|null, filter: DrillsFilter) {
  return (items || []).filter((drill) => {
    if (filter.name && !fuzzy.match(filter.name, drill.name)) {
      return false;
    }
    if ((filter.environment != null && filter.environment.length) &&
        !intersects(drill.environment, filter.environment)) {
      return false;
    }
    if (filter.minLevel != null && drill.maxLevel < filter.minLevel) {
      return false;
    }
    if (filter.maxLevel != null && drill.minLevel > filter.maxLevel) {
      return false;
    }
    if (filter.focus != null && filter.focus.length && !intersects(drill.focus, filter.focus)) {
      return false;
    }
    if (filter.idealPlayers &&
        (drill.minPlayers > filter.idealPlayers || drill.maxPlayers < filter.idealPlayers)) {
      return false;
    }
    /* Note that verified is a tri-state - if it's undefined, that means we don't care. If it's
     * true, that means it must be true. If it's false, that means it must be false.  */
    if (filter.verified === false && drill.verified !== false) {
      return false;
    }
    if (filter.verified === true && drill.verified !== true) {
      return false;
    }
    // Same deal with starred.
    if (filter.starred !== undefined) {
      const user = authService.getUserSync();
      if (!user) {
        return false;
      }
      if (filter.starred && !(user.favoriteDrills || []).includes(drill.id)) {
        return false;
      }
      if (!filter.starred && (user.favoriteDrills || []).includes(drill.id)) {
        return false;
      }
    }
    return true;
  });
}
