import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Statistics} from '../model/statistics';
import {Observable} from 'rxjs';
import {ProductService} from './product.service';
import {Product} from '../model/product';
import {withDependencies} from './utils';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient, private productService: ProductService) {
  }

  list(products?: Product[]): Observable<Statistics> {
    return withDependencies(
      this.http.get<Statistics.Dto>('/statistics'),
      [products, this.productService.list]
    ).pipe(
      map(([dto, productsDep]: [Statistics.Dto, Product[], {}, {}]) => Statistics.fromDto(dto, productsDep))
    );
  }
}
