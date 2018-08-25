import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { tap, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '../../../node_modules/@angular/material';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService, private readonly router: Router,
  private readonly snackBar: MatSnackBar) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.auth.user.pipe(
           take(1),
           map(user => {
             console.log(JSON.stringify(user));
           return !!user;
           }),
           tap(loggedIn => {
             if (!loggedIn) {
              this.snackBar.open('You must login to access this page', '', {duration: 1000});
               this.router.navigate(['/profile']);
             }
         }));
  }
}
