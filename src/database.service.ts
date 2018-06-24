import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { DrillWithId, DrillsState } from './app/model/types';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  drills: Observable<DrillWithId[]>;
  drillsCollection: AngularFirestoreCollection<DrillsState>;

  constructor(db: AngularFirestore) {
    this.drillsCollection = db.collection('drills');
    this.drills = this.drillsCollection.snapshotChanges().pipe(
      map((snapshot) =>
              snapshot.map((snap) => ({...snap.payload.doc.data(), id : snap.payload.doc.id}))
                  .sort((snap1, snap2) => snap1.name.localeCompare(snap2.name))),
                shareReplay(1));

  }
}
