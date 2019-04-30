import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {User} from '../model/user';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {GroupService} from './group.service';
import {Group} from '../model/group';
import {processErrors, withDependencies} from './utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private groupService: GroupService) {
  }

  me(groups?: Group[]): Observable<User> {
    return withDependencies(
      this.http.get<User.Dto>('/users/me'),
      [groups, () => this.groupService.list()]
    ).pipe(
      map(([dto, groupsDep]: [User.Dto, Group[], {}, {}]) => User.fromDto(dto, groupsDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  list(groups?: Group[]): Observable<User[]> {
    return withDependencies(
      this.http.get<User.Dto[]>('/users'),
      [groups, () => this.groupService.list()]
    ).pipe(
      map(([dtos, groupsDep]: [User.Dto[], Group[], {}, {}]) => dtos.map((dto: User.Dto) => User.fromDto(dto, groupsDep))),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  create(user: User, groups?: Group[]): Observable<User> {
    return withDependencies(
      this.http.post<User.Dto>('/users', user.toDto()),
      [groups, () => this.groupService.list()]
    ).pipe(
      map(([dto, groupsDep]: [User.Dto, Group[], {}, {}]) => User.fromDto(dto, groupsDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  update(user: User, groups?: Group[]): Observable<User> {
    return withDependencies(
      this.http.patch<User.Dto>(`/users/${user.id}`, user.toDto()),
      [groups, () => this.groupService.list()]
    ).pipe(
      map(([dto, groupsDep]: [User.Dto, Group[], {}, {}]) => User.fromDto(dto, groupsDep)),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  delete(user: User): Observable<null> {
    return this.http.delete<null>(`/users/${user.id}`).pipe(
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
