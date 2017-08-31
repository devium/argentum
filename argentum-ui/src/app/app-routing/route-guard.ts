import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { RestService } from '../common/rest-service/rest.service';
import { UserResponse } from '../common/rest-service/response/user-response';

@Injectable()
export class RouteGuard implements CanActivate {

  constructor(private restService: RestService, private router: Router) {
  }

  readonly ROUTE_MAPPING: { [home: string]: [string] } = {
    '/admin': ['ADMIN'],
    '/order': ['ORDER'],
    '/scan': ['SCAN'],
    '/checkin': ['CHECKIN', 'RECHARGE', 'REFUND']
  };

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    let path = route.url[0].path;

    if (!localStorage.getItem('token')) {
      return path == 'login' || this.redirectHome([]);
    }

    if (path == 'logout') {
      this.logout();
      return this.redirectHome([]);
    }

    return this.restService.getUser()
      .then((user: UserResponse) => {
        localStorage.setItem('roles', user.roles.join(','));
        switch (path) {
          case 'login':
          case 'home':
            return this.redirectHome(user.roles);
          case 'order':
            return this.redirectIfNotAllowed(user.roles, ['ORDER', 'ADMIN']);
          case 'checkin':
            return this.redirectIfNotAllowed(user.roles, ['CHECKIN', 'RECHARGE', 'ADMIN']);
          case 'scan':
            return this.redirectIfNotAllowed(user.roles, ['SCAN', 'ADMIN']);
          case 'admin':
          case 'admin/dashboard':
          case 'admin/products':
          case 'admin/categories':
          case 'admin/ranges':
          case 'admin/guests':
          case 'admin/import':
          case 'admin/users':
          case 'admin/config':
            return this.redirectIfNotAllowed(user.roles, ['ADMIN']);
        }
      })
      .catch(error => {
        this.logout();

        if (path != 'login') {
          return this.redirectHome([]);
        }
        return Promise.resolve(true);
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  }

  redirectIfNotAllowed(userRoles: string[], requiredRoles: string[]): Promise<boolean> {
    let allowed = requiredRoles
      .map(role => userRoles.indexOf(role) > -1)
      .reduce((a, b) => a || b, false);

    if (!allowed) {
      return this.redirectHome(userRoles);
    }
    return Promise.resolve(true);
  }

  redirectHome(roles: string[]): Promise<boolean> {
    let redirect: string;
    for (let route in this.ROUTE_MAPPING) {
      if (roles.filter(role => this.ROUTE_MAPPING[route].includes(role)).length) {
        redirect = route;
        break;
      }
    }
    if (!redirect) {
      redirect = '/login'
    }
    console.log(`Redirecting to ${redirect}`);
    this.router.navigate([redirect]);

    return Promise.resolve(false);
  }
}
