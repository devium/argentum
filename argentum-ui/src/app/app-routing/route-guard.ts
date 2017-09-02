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
    'admin/config'
  ];

  // Allowed sites per role.
  // Note: the first path in the array will be considered the respective role's home page.
  readonly ROLES_TO_PATH: { [role: string]: string[] } = {
    'ADMIN': ['admin', 'order', 'checkin', 'scan'].concat(this.ADMIN_SUBPATHS),
    'ORDER': ['order'],
    'CHECKIN': ['checkin'],
    'RECHARGE': ['checkin'],
    'REFUND': ['checkin'],
    'SCAN': ['scan']
  };

  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  }

  constructor(private restService: RestService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    const path = route.url[0].path;

    if (path === 'login') {
      RouteGuard.logout();
      return true;
    }

    if (path === 'logout' || !localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.restService.getUser()
      .then((user: UserResponse) => {
        localStorage.setItem('roles', user.roles.join(','));

        // If role is allowed to access, return true.
        for (const role in this.ROLES_TO_PATH) {
          if (user.roles.includes(role)) {
            if (this.ROLES_TO_PATH[role].includes(path)) {
              return Promise.resolve(true);
            }
          }
        }

        // Not allowed, redirect to home.
        const home: string = this.ROLES_TO_PATH[user.roles[0]][0];
        this.router.navigate([home]);
        return Promise.resolve(false);
      })
      .catch(() => {
        // TODO
        console.log('no user/token or backend offline');
        this.router.navigate(['/login']);
        return Promise.resolve(false);
      });
  }
}
