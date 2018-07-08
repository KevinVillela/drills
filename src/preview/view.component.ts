import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Drill, DrillWithId } from '../app/model/types';
import { map, switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'drills-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewDrillComponent  {

  @Input() drillId: string;
  drill: Observable<DrillWithId|undefined>;

  constructor(private readonly dbService: DatabaseService, route: ActivatedRoute
  ) {
    this.drill = route.params.pipe(
      switchMap((params: Params) => {
      return this.dbService.drillForId(params['id']);
    }));
  }

}
