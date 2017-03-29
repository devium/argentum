import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { RestService } from '../common/rest-service/rest.service';
import { UserResponse } from '../common/rest-service/response/user-response';

@Injectable()
export class RouteGuard implements CanActivate {

  constructor(private restService: RestService, private router: Router) {
  }

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
            return this.redirectIfNotAllowed(user.roles, ['CHECKIN', 'ADMIN']);
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
    console.log(roles);

    let redirect: string;
    if (roles.indexOf("ADMIN") > -1) {
      redirect = '/admin';
    } else if (roles.indexOf("ORDER") > -1) {
      redirect = '/order';
    } else if (roles.indexOf("CHECKIN") > -1) {
      redirect = '/checkin';
    } else if (roles.indexOf("SCAN") > -1) {
      redirect = '/scan';
    } else {
      this.logout();
      redirect = '/login';
    }
    console.log(`Redirecting to ${redirect}`);
    this.router.navigate([redirect]);

    return Promise.resolve(false);
  }
}
