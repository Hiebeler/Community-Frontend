import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const user = this.authService.activeUserId();
    const community = this.authService.activeCommunityId();

    const role = user ? (community ? 'community' : 'onboarding') : 'none';

    const allowedRoles: string[] = next.data.roles ?? [];

    if (allowedRoles.includes(role)) return true;

    if (role === 'community') this.router.navigate(['calendar']);
    else if (role === 'onboarding') this.router.navigate(['onboarding']);
    else this.router.navigate(['login']);

    return false;
  }
}
