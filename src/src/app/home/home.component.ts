import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

import {DrillsState} from '../../../app/model/types';
import { Router } from '@angular/router';

@Component({
  selector: 'drills-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  drillsCollection: AngularFirestoreCollection<DrillsState>;
  drills: Observable<DrillsState[]>;

  constructor(private readonly db: AngularFirestore, private readonly router: Router) {
    this.drillsCollection = db.collection('drills');
    this.drills = this.drillsCollection.snapshotChanges().pipe(
        map((snapshot) => snapshot.map((snap) => ({...snap.payload.doc.data(), id: snap.payload.doc.id}))));
    this.drills.subscribe((snapshot) => console.log(snapshot));
  }

  edit(drillId: string) {
    this.router.navigateByUrl(`edit/${drillId}`);
  }

  new() {
    this.router.navigateByUrl('edit');
  }
  ngOnInit() {}
}
