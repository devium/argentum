import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../common/model/user';
import {Group} from '../common/model/group';
import {UserService} from '../common/rest-service/user.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class RouteGuard implements CanActivate {

  readonly ADMIN_SUBPATHS: string[] = [
    'admin/dashboard',
    'admin/products',
    'admin/categories',
    'admin/ranges',
    'admin/guests',
    'admin/import',
    'admin/users',
    'admin/statuses',
    'admin/config'
  ];

  // Allowed sites per role.
  // Note: the first path in the array will be considered the respective role's home page.
  readonly GROUPS_TO_PATH: { [role: string]: string[] } = {
    'admin': ['admin'].concat(this.ADMIN_SUBPATHS),
    'coat_check': ['coat_check'],
    'order': ['order'],
    'check_in': ['checkin'],
    'transfer': ['checkin'],
    'scan': ['scan']
  };

  static logout(): void {
    localStorage.clear();
  }

  private resolveHome(groups: Group[]): string {
    for (const homeGroup in this.GROUPS_TO_PATH) {
      if (this.GROUPS_TO_PATH.hasOwnProperty(homeGroup)) {
        for (const group of groups) {
          if (group.name === homeGroup) {
            return '/' + this.GROUPS_TO_PATH[group.name][0];
          }
        }
      }
    }
    return '';
  }

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
    const path = route.url[0].path;
    console.log(`Checking permissions for route ${path}.`);

    if (path === 'login') {
      console.log('At login page. Logging out.');
      RouteGuard.logout();
      return true;
    }

    if (path === 'logout') {
      return this.router.parseUrl('/login');
    }

    if (!localStorage.getItem('token')) {
      console.log('No access token. Redirecting to login.');
      return this.router.parseUrl('/login');
    }

    console.log('Getting user information from backend.');
    return this.userService.me().pipe(
      map((user: User) => {
        console.log(`Roles: ${user.groups}`);
        localStorage.setItem('roles', user.groups.join(','));

        const home = this.resolveHome(user.groups);
        if (path === 'home') {
          if (!home) {
            console.log('No home for user roles. Logging out.');
            return this.router.parseUrl('/login');
          } else {
            console.log(`Redirecting to home ${home}`);
            return this.router.parseUrl(home);
          }
        }
        // If role is allowed to access, return true.
        for (const group in this.GROUPS_TO_PATH) {
          if (user.groups.map((userGroup: Group) => userGroup.name).includes(group)) {
            if (this.GROUPS_TO_PATH[group].includes(path)) {
              return true;
            }
          }
        }
        console.log(`User denied. Redirecting to home ${home}`);
        // Not allowed, redirect to home.
        return this.router.parseUrl(home);
      }),
      catchError((err: any) => {
        console.log('API error. Logging out.');
        return of(this.router.parseUrl('/login'));
      }));
  }
}
