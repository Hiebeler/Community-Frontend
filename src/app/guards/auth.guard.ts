import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const allowedRoles: string[] = next.data.roles ?? [];

    return combineLatest([
      this.authService.activeUserId,
      this.authService.activeCommunityId,
    ]).pipe(
      map(([user, community]) => {
        let role;

        if (user) {
          if (community) {
            role = 'community';
          } else {
            role = 'onboarding';
          }
        } else {
          role = 'none';
        }

        if (allowedRoles.indexOf(role) !== -1) {
          return true;
        } else {
          if (role === 'community') {
            this.router.navigate(['calendar']);
          } else if (role === 'onboarding') {
            this.router.navigate(['onboarding']);
          } else {
            this.router.navigate(['login']);
          }
          return false;
        }
      })
    );
  }
}
