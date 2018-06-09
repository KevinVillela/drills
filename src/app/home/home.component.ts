import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {first, map} from 'rxjs/operators';

import {DrillsState, Environment} from '../model/types';

export type DrillWithId = DrillsState&{id: string};
@Component({
  selector : 'drills-home',
  templateUrl : './home.component.html',
  styleUrls : [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
  drillsCollection: AngularFirestoreCollection<DrillsState>;
  drills: Observable<DrillWithId[]>;

  constructor(private readonly db: AngularFirestore, private readonly router: Router) {
    this.drillsCollection = db.collection('drills');
    this.drills = this.drillsCollection.snapshotChanges().pipe(
        map((snapshot) =>
                snapshot.map((snap) => ({...snap.payload.doc.data(), id : snap.payload.doc.id}))
                    .sort((snap1, snap2) => snap1.name.localeCompare(snap2.name))));
    /* this.drills.subscribe((snapshot) => {
       snapshot.forEach((drill) => {
         this.db.doc(`drills/${drill.id}`).update({...drill, environment: [Environment.BEACH]});
       });
     }); */
  }

  ngOnInit() {}
}
