import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {CategoryService} from './category.service';
import {StatusService} from './status.service';
import {Discount} from '../model/discount';
import {Observable} from 'rxjs';
import {processErrors, withDependencies} from './utils';
import {Category} from '../model/category';
import {Status} from '../model/status';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(private http: HttpClient, private statusService: StatusService, private categoryService: CategoryService) {
  }

  list(statuses?: Status[], categories?: Category[]): Observable<Discount[]> {
    return withDependencies(
      this.http.get<Discount.Dto[]>('/discounts'),
      [statuses, () => this.statusService.list()],
      [categories, () => this.categoryService.list()]
    ).pipe(
      map(([dtos, statusesDep, categoriesDep]: [Discount.Dto[], Status[], Category[], {}]) => {
        return dtos.map((dto: Discount.Dto) => Discount.fromDto(dto, statusesDep, categoriesDep));
      }),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  listByCard(card: string, statuses?: Status[], categories?: Category[]): Observable<Discount[]> {
    return withDependencies(
      this.http.get<Discount.Dto[]>('/discounts', {params: {status__guests__card: card}}),
      [statuses, () => this.statusService.list()],
      [categories, () => this.categoryService.list()]
    ).pipe(
      map(([dtos, statusesDep, categoriesDep]: [Discount.Dto[], Status[], Category[], {}]) => {
        return dtos.map((dto: Discount.Dto) => Discount.fromDto(dto, statusesDep, categoriesDep));
      }),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  create(discount: Discount, statuses?: Status[], categories?: Category[]): Observable<Discount> {
    return withDependencies(
      this.http.post<Discount.Dto>('/discounts', discount.toDto()),
      [statuses, () => this.statusService.list()],
      [categories, () => this.categoryService.list()]
    ).pipe(
      map(([dto, statusesDep, categoriesDep]: [Discount.Dto, Status[], Category[], {}]) => {
        return Discount.fromDto(dto, statusesDep, categoriesDep);
      }),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  update(discount: Discount, statuses?: Status[], categories?: Category[]): Observable<Discount> {
    return withDependencies(
      this.http.patch<Discount.Dto>(`/discounts/${discount.id}`, discount.toDto()),
      [statuses, () => this.statusService.list()],
      [categories, () => this.categoryService.list()]
    ).pipe(
      map(([dto, statusesDep, categoriesDep]: [Discount.Dto, Status[], Category[], {}]) => {
        return Discount.fromDto(dto, statusesDep, categoriesDep);
      }),
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }

  delete(discount: Discount): Observable<null> {
    return this.http.delete<null>(`/discounts/${discount.id}`).pipe(
      catchError((err: HttpErrorResponse) => processErrors(err))
    );
  }
}
