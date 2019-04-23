import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group, GroupDto} from '../model/group';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
  }

  list(): Observable<Group[]> {
    return this.http.get('/groups').pipe(
      map((dtos: GroupDto[]) => dtos.map((dto: GroupDto) => Group.fromDto(dto)))
    );
  }
}
