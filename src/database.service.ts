import {Injectable} from '@angular/core';
import {Timestamp} from '@firebase/firestore-types';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {map, shareReplay, take, mapTo, switchMap} from 'rxjs/operators';

import {DrillsState, DrillWithId, Environment, Drill} from './app/model/types';
import {of} from 'rxjs/observable/of';
import {from} from 'rxjs/observable/from';
import { AuthService } from './core/auth/auth.service';

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}

export interface PlanDrill {
  drillId: string;
  duration: number;
}

export interface Plan {
  drills: PlanDrill[];
  environment: Environment;
  numPlayers: number;
  title: string;
  location: string;
  datetime?: Timestamp;
  notes?: string;
}

@Injectable({providedIn : 'root'})
export class DatabaseService {
  drills: Observable<DrillWithId[]>;
  plansCollection: AngularFirestoreCollection<Plan>;
  drillsCollection: AngularFirestoreCollection<DrillWithId>;
  user: User|undefined|null;

  constructor(private readonly db: AngularFirestore, private readonly authService: AuthService) {
    this.drillsCollection = db.collection('drills');
    this.plansCollection = db.collection('plans');
    this.drills = this.drillsCollection.snapshotChanges().pipe(
        map((snapshot) =>
                snapshot.map((snap) => ({...snap.payload.doc.data(), id : snap.payload.doc.id}))
                    .sort((snap1, snap2) => snap1.name.localeCompare(snap2.name))),
        shareReplay(1));
        this.authService.user.subscribe((user) => {
          this.user = user;
        });
  }

  userForId(userId: string|undefined): Observable<User|undefined> {
    if (!userId) {
      return of(undefined);
    }
    return this.db.doc<User>(`users/${userId}`).valueChanges();
  }

  drillForId(drillId: string): Observable<DrillWithId|undefined> {
    return this.db.doc<DrillWithId>(`drills/${drillId}`).valueChanges();
  }

  updateDrill(drillId: string, newDrill: Drill) {
    return this.db.doc(`drills/${drillId}`).update(newDrill);
  }

  addDrill(newDrill: Drill) {
    if (this.user) {
      newDrill.creator = this.user.uid;
    }
    return this.drillsCollection.add(newDrill as DrillWithId);
  }

  deleteDrill(drillId: string) {
    return this.db.doc(`drills/${drillId}`).delete();
  }

  upsertPlan(plan: Plan, planId?: string): Promise<string> {
    if (planId) {
      return this.plansCollection.doc(planId).update(plan).then(() => planId);
    } else {
      return this.plansCollection.add(plan).then((reference) => reference.id);
    }
  }

  loadPlan(planId: string) { return this.plansCollection.doc<Plan>(planId).valueChanges(); }

  migrate(drillId?: string) {
    this.drills.pipe(take(1),
    switchMap((snapshot) => from(snapshot))).subscribe((drill) => {
      if (!drillId || drill.id === drillId) {
        console.log('updating');
        this.db.doc(`drills/${drill.id}`)
            .update({...drill, creator : 'febuvn0t65RH483TL6BKota0PFr1'})
            .then(() => console.log('update successful'))
            .catch((err) => { console.error(`Error updating with ID ${drill.id}: ${err}`); });
      }
  });
  }
}
