import { Pipe, PipeTransform } from '@angular/core';
import { Drill, DrillFocus, DrillWithId } from '../app/model/types';
import { DrillsFilter } from './filter.component';

@Pipe({
  name: 'search',
  pure: false,
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: DrillWithId[]|null, filter: Drill) {
    return searchFilter(items, filter);
}
}

function intersects(array1: Array<{}>, array2: Array<{}>): boolean {
  return array1.filter(value => -1 !== array2.indexOf(value)).length !== 0;
}

export function searchFilter(items: DrillWithId[]|null, filter: DrillsFilter) {
  return (items || []).filter((drill) => {
    if ((filter.environment != null && filter.environment.length) && !intersects(drill.environment, filter.environment)) {
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
    if (filter.idealPlayers && (drill.minPlayers > filter.idealPlayers || drill.maxPlayers < filter.idealPlayers)) {
      return false;
    }
    return true;
  });
}
