import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { filter, take, map } from 'rxjs/operators';

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
      take(1),
      map(role => {
        if (allowedRoles.indexOf(role) !== -1) {
          return true;
        }
        else {
          if (role === 'community') {
            this.router.navigate(['tabs/tasks']);
          }
          else if (role === 'user') {
            this.router.navigate(['profile']);
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
