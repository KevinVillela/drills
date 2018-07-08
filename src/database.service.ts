import {Injectable} from '@angular/core';
import {Timestamp} from '@firebase/firestore-types';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {from} from 'rxjs/observable/from';
import {of} from 'rxjs/observable/of';
import {map, mapTo, shareReplay, switchMap, take, flatMap, filter, tap} from 'rxjs/operators';

import {Drill, DrillsState, DrillWithId, Environment} from './app/model/types';
import {AuthService} from './core/auth/auth.service';

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  favoriteDrills?: string[];
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

export interface PlanWithId extends Plan {
  id: string;
}

@Injectable({providedIn : 'root'})
export class DatabaseService {
  readonly drills: Observable<DrillWithId[]>;
  readonly plansCollection: AngularFirestoreCollection<Plan>;
  readonly drillsCollection: AngularFirestoreCollection<DrillWithId>;
  readonly plansSnapshot: Observable<PlanWithId[]>;
  user: User|undefined|null;

  constructor(private readonly db: AngularFirestore, private readonly authService: AuthService) {
    this.drillsCollection = db.collection('drills');
    this.plansCollection = db.collection('plans');
    this.plansSnapshot = this.plansCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Plan;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
      shareReplay(1),
    );
    this.drills = this.drillsCollection.snapshotChanges().pipe(
        map((snapshot) =>
                snapshot.map((snap) => ({...snap.payload.doc.data(), id : snap.payload.doc.id}))
                    .sort((snap1, snap2) => snap1.name.localeCompare(snap2.name))),
        shareReplay(1));
    this.authService.user.subscribe((user) => { this.user = user; });
  }

  private userDocForId(userId: string) {
    return this.db.doc<User>(`users/${userId}`);
  }

  userForId(userId: string|undefined): Observable<User|undefined> {
    if (!userId) {
      return of(undefined);
    }
    return this.userDocForId(userId).valueChanges();
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

  deleteDrill(drillId: string) { return this.db.doc(`drills/${drillId}`).delete(); }

  isDrillStarred(drillId: string): Observable<boolean> {
    return this.authService.user.pipe(
      map((user) => {
        if (!user) {
          return false;
        }
        return (user.favoriteDrills || []).includes(drillId);
      }
    ));
  }

  updateStarredDrill(drillId: string, starred: boolean) {
    const currentUser = this.authService.getUserDoc();
    if (!currentUser) {
      alert('Plese login to use the starred functionality.');
      return;
    }
    const userAgain = this.authService.getUserSync();
    if (!userAgain) {
      console.error('Tried to update starred when user was not logged in');
      return;
    }
    const currentFavorites = (userAgain.favoriteDrills || []).filter((tempDrillId) => tempDrillId !== drillId);
    if (starred) {
      currentFavorites.push(drillId);
    }
    currentUser.update({favoriteDrills: currentFavorites});
   }

  upsertPlan(plan: Plan, planId?: string): Promise<string> {
    if (planId) {
      return this.plansCollection.doc(planId).update(plan).then(() => planId);
    } else {
      return this.plansCollection.add(plan as PlanWithId).then((reference) => reference.id);
    }
  }

  loadPlan(planId: string) {
    return this.plansSnapshot.pipe(
      flatMap((plans) => plans),
      filter((plan) =>  plan.id === planId), );
    /* return this.plansCollection.doc<Plan>(planId).valueChanges(); */
   }

  migrate(drillId?: string) {
    this.drills.pipe(take(1), switchMap((snapshot) => from(snapshot))).subscribe((drill) => {
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
