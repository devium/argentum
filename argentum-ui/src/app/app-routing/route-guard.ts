import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { RestService } from '../common/rest-service/rest.service';
import { User } from '../common/model/user';
import {Group} from '../common/model/group';

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

  constructor(private restService: RestService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    const path = route.url[0].path;
    console.log(`Checking permissions for route ${path}.`);

    if (path === 'login') {
      console.log('At login page. Logging out.');
      RouteGuard.logout();
      return true;
    }

    if (path === 'logout') {
      this.router.navigate(['/login']);
      return false;
    }

    if (!localStorage.getItem('token')) {
      console.log('No access token. Redirecting to login.');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('Getting user information from backend.');
    return this.restService.getUser()
      .then((user: User) => {
        console.log(`Roles: ${user.groups}`);
        localStorage.setItem('roles', user.groups.join(','));

        if (path === 'home') {
          const homePath = this.resolveHome(user.groups);

          if (!homePath) {
            console.log(`No home for user roles. Logging out.`);
            this.router.navigate(['/login']);
          } else {
            console.log(`Redirecting to home ${homePath}`);
            this.router.navigate([homePath]);
          }
          return false;
        }

        // If role is allowed to access, return true.
        for (const group in this.GROUPS_TO_PATH) {
          if (user.groups.map((userGroup: Group) => userGroup.name).includes(group)) {
            if (this.GROUPS_TO_PATH[group].includes(path)) {
              return Promise.resolve(true);
            }
          }
        }

        console.log(`User denied. Redirecting to home.`);
        // Not allowed, redirect to home.
        const home: string = this.resolveHome(user.groups);
        this.router.navigate([home]);
        return Promise.resolve(false);
      })
      .catch(() => {
        this.router.navigate(['/login']);
        return Promise.resolve(false);
      });
  }
}
