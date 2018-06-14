import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { RestService } from '../common/rest-service/rest.service';
import { UserResponse } from '../common/rest-service/response/user-response';

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
  readonly ROLES_TO_PATH: { [role: string]: string[] } = {
    'ADMIN': ['admin'].concat(this.ADMIN_SUBPATHS),
    'ORDER': ['order'],
    'CHECKIN': ['checkin'],
    'TRANSFER': ['checkin'],
    'SCAN': ['scan']
  };

  static logout(): void {
    localStorage.clear();
  }

  private resolveHome(roles: string[]): string {
    for (const home_role in this.ROLES_TO_PATH) {
      if (this.ROLES_TO_PATH.hasOwnProperty(home_role)) {
        for (const role of roles) {
          if (role === home_role) {
            return '/' + this.ROLES_TO_PATH[role][0];
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
      .then((user: UserResponse) => {
        console.log(`Roles: ${user.roles}`);
        localStorage.setItem('roles', user.roles.join(','));

        if (path === 'home') {
          const home = this.resolveHome(user.roles);

          if (!home) {
            console.log(`No home for user roles. Logging out.`)
            this.router.navigate(['/login']);
          } else {
            console.log(`Redirecting to home ${home}`);
            this.router.navigate([home]);
          }
          return false;
        }

        // If role is allowed to access, return true.
        for (const role in this.ROLES_TO_PATH) {
          if (user.roles.includes(role)) {
            if (this.ROLES_TO_PATH[role].includes(path)) {
              return Promise.resolve(true);
            }
          }
        }

        console.log(`User denied. Redirecting to home.`);
        // Not allowed, redirect to home.
        const home: string = this.resolveHome(user.roles);
        this.router.navigate([home]);
        return Promise.resolve(false);
      })
      .catch(() => {
        this.router.navigate(['/login']);
        return Promise.resolve(false);
      });
  }
}
