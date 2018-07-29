import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {auth} from 'firebase';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {switchMap, take, shareReplay} from 'rxjs/operators';
import { User } from '../../database.service';

@Injectable()
export class AuthService {

  allUsers: Observable<User[]>;
  user: Observable<User|null|undefined>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore,
              private router: Router) {
    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }),
  shareReplay(1));
  }

  getUserDoc() {
    const currentUser = this.afAuth.auth.currentUser;
    if (currentUser) {
      return this.afs.doc<User>(`users/${currentUser.uid}`);
    }
    return null;
  }

  getUserSync(): User|undefined|null {
    let user: User|undefined|null = null;
    this.user.pipe(take(1)).subscribe((tmp) => {
      user = tmp;
    });
    return user;
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(
        (credential) => { this.updateUserData(credential.user); });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<Partial<User>> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid : user.uid,
      email : user.email,
      displayName : user.displayName,
      photoURL : user.photoURL,
    };

    return userRef.set(data, {merge : true});
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => { this.router.navigate([ '/' ]); });
  }
}
