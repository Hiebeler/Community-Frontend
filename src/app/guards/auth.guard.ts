import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {

    const allowedRoles: string[] = next.data.roles ?? [];

    return this.authService.authenticationState.pipe(
      filter(val => val !== null),
      map(role => {
        if (allowedRoles.indexOf(role) !== -1) {
          return true;
        }
        else {
          if (role === 'community') {
            this.router.navigate(['calendar']);
          }
          else if (role === 'onboarding') {
            this.router.navigate(['onboarding']);
          }
          else {
            this.router.navigate(['login']);
          }
          return false;
        }
      })
    );
  }
}
