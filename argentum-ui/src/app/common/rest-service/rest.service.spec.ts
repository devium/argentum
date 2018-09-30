import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RestService } from './rest.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GUESTS, JIMMY, NORBERT } from './mocks/mock-guests';
import { HttpClient } from '@angular/common/http';
import { CoatCheckTag } from '../model/coat-check-tag';
import { Product } from '../model/product';
import { COCKTAIL, COKE, PEPSI } from './mocks/mock-products';
import { ProductRange } from '../model/product-range';
import { Category } from '../model/category';
import { convertCard } from '../util/convert-card';
import { Guest } from '../model/guest';
import { Order } from '../model/order';
import { ORDERS } from './mocks/mock-orders';
import { Status } from '../model/status';
import { DEFAULT, PAID } from './mocks/mock-statuses';
import { Statistics } from '../model/statistics';
import { STATISTICS } from './mocks/mock-statistics';
import { User } from '../model/user';
import { ADMIN, BARKEEPER, RECEPTION, USERS } from './mocks/mock-users';
import { Config } from '../model/config';
import { CONFIG } from './mocks/mock-config';
import { TokenResponse } from './response/token-response';
import { TOKEN } from './mocks/mock-tokens';
import { BAR, BUFFET, COATCHECK } from './mocks/mock-ranges';
import { BEV_ALC, BEV_NONALC } from './mocks/mock-categories';
import createSpyObj = jasmine.createSpyObj;

describe('RestService', () => {
  let http: HttpClient;
  let restService: RestService;
  let httpTestingController: HttpTestingController;
  let resolved = false;
  const requestData: any = require('./mocks/mock-requests.json');
  const responseData: any = require('./mocks/mock-responses.json');
  const router = createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    restService = new RestService(http, router);
    resolved = false;
  });

  afterEach(() => {
    expect(resolved).toBeTruthy('Request callback was not called.');
  });

  it('should GET /guests/<guest_id>/coat_check_tags correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/guests/2/coat_check_tags';

    restService.getGuestCoatCheckTags(JIMMY)
      .then((coatCheckTags: CoatCheckTag[]) => {
        expect(coatCheckTags.length).toBe(2);
        expect(coatCheckTags[0].id).toBe(3);
        expect(coatCheckTags[0].time).toEqual(new Date(2018, 11, 31, 22, 10));
        expect(coatCheckTags[0].guest).toEqual(JIMMY);
        expect(coatCheckTags[1].id).toBe(7);
        expect(coatCheckTags[1].time).toEqual(new Date(2018, 11, 31, 22, 25));
        expect(coatCheckTags[1].guest).toEqual(JIMMY);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toBeNull();
    req.flush(responseData[method + path]);
  }));

  it('should GET /coat_check correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/coat_check';

    restService.getAllCoatCheckTags()
      .then((tags: number[]) => {
        expect(tags).toEqual([3, 7, 12]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toBeNull();
    req.flush(responseData[method + path]);
  }));

  it('should DELETE /coat_check correctly', fakeAsync(() => {
    const method = 'DELETE';
    const path = '/coat_check';

    restService.deregisterTags([4, 5])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should PUT /coat_check correctly', fakeAsync(() => {
    const method = 'PUT';
    const path = '/coat_check';

    restService.registerTags([6, 12], JIMMY, 1.50)
      .then((coatCheckTags: CoatCheckTag[]) => {
        expect(coatCheckTags.length).toBe(2);
        expect(coatCheckTags[0].id).toBe(6);
        expect(coatCheckTags[0].time).toEqual(new Date(2018, 11, 31, 22, 5));
        expect(coatCheckTags[0].guest).toEqual(JIMMY);
        expect(coatCheckTags[1].id).toBe(12);
        expect(coatCheckTags[1].time).toEqual(new Date(2018, 11, 31, 22, 5));
        expect(coatCheckTags[1].guest).toEqual(JIMMY);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(responseData[method + path]);
  }));

  it('should GET /products/all correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/products/all';

    restService.getAllProducts()
      .then((products: Product[]) => {
        expect(products).toEqual([COCKTAIL, COKE, PEPSI]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should POST /products correctly', fakeAsync(() => {
    const method = 'POST';
    const path = '/products';

    restService.mergeProducts([COCKTAIL, COKE])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should DELETE /products correctly', fakeAsync(() => {
    const method = 'DELETE';
    const path = '/products';

    restService.deleteProducts([COCKTAIL, COKE])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should GET /ranges correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/ranges';

    restService.getProductRanges()
      .then((ranges: ProductRange[]) => {
        expect(ranges).toEqual([BAR, BUFFET]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should GET /ranges/<range_id> correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/ranges/1';

    restService.getRangeProducts(BAR)
      .then((products: Product[]) => {
        expect(products).toEqual([COCKTAIL, COKE]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should POST /ranges correctly', fakeAsync(() => {
    const method = 'POST';
    const path = '/ranges';

    restService.mergeProductRanges([BUFFET, COATCHECK])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should DELETE /ranges correctly', fakeAsync(() => {
    const method = 'DELETE';
    const path = '/ranges';

    restService.deleteProductRanges([BUFFET, COATCHECK])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should GET /categories correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/categories';

    restService.getCategories()
      .then((categories: Category[]) => {
        expect(categories).toEqual([BEV_ALC, BEV_NONALC]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should POST /categories correctly', fakeAsync(() => {
    const method = 'POST';
    const path = '/categories';

    restService.mergeCategories([BEV_ALC, BEV_NONALC])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(null);
  }));

  it('should DELETE /categories correctly', fakeAsync(() => {
    const method = 'DELETE';
    const path = '/categories';

    restService.deleteCategories([BEV_ALC, BEV_NONALC])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(null);
  }));

  it('should request all product data correctly using GET on /products, /ranges, and /categories', fakeAsync(() => {
    const method = 'GET';
    const pathProducts = '/products';
    const pathRanges = '/ranges';
    const pathCategories = '/categories';

    restService.getProductData()
      .then((productData: { products: Product[], categories: Category[], ranges: ProductRange[] }) => {
        expect(productData.products).toEqual([COCKTAIL, COKE]);
        expect(productData.categories).toEqual([BEV_ALC, BEV_NONALC]);
        expect(productData.ranges).toEqual([BAR, BUFFET]);

        resolved = true;
      });

    const reqProducts = httpTestingController.expectOne(restService.apiUrl + pathProducts);
    expect(reqProducts.request.method).toBe(method);
    reqProducts.flush(responseData[method + pathProducts]);

    const reqRanges = httpTestingController.expectOne(restService.apiUrl + pathRanges);
    expect(reqRanges.request.method).toBe(method);
    reqRanges.flush(responseData[method + pathRanges]);

    const reqCategories = httpTestingController.expectOne(restService.apiUrl + pathCategories);
    expect(reqCategories.request.method).toBe(method);
    reqCategories.flush(responseData[method + pathCategories]);
  }));

  it('should GET /guests/card/<card> correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/guests/card/8102162';

    restService.getGuestByCard(convertCard('12341234'))
      .then((guest: Guest) => {
        expect(guest).toEqual(JIMMY);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should GET /guests/?<query> correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/guests/?size=3&page=1&code=4&name=r&mail=j&status=default&sort=balance&direction=desc';

    restService.getGuestsPaginatedAndFiltered(3, 1, '4', 'r', 'j', 'default', 'balance', 'desc')
      .then((response: { guests: Guest[], guestsTotal: number }) => {
        // Response not actually correct.
        expect(response.guestsTotal).toBe(GUESTS.length);
        expect(response.guests).toEqual([GUESTS[3], GUESTS[6], GUESTS[11]]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should GET /guests/search/code/<query> correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/guests/search/code/11';

    restService.getGuestsBySearch('code', '11')
      .toPromise()
      .then((guests: Guest[]) => {
        expect(guests).toEqual([GUESTS[19], GUESTS[36], GUESTS[41]]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should GET /guests/search/name/<query> correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/guests/search/name/e';

    restService.getGuestsBySearch('name', 'e')
      .toPromise()
      .then((guests: Guest[]) => {
        expect(guests).toEqual([GUESTS[0], GUESTS[1], GUESTS[3]]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should GET /guests/search/mail/<query> correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/guests/search/mail/org';

    restService.getGuestsBySearch('mail', 'org')
      .toPromise()
      .then((guests: Guest[]) => {
        expect(guests).toEqual([GUESTS[3], GUESTS[6], GUESTS[24]]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should POST /guests correctly', fakeAsync(() => {
    const method = 'POST';
    const path = '/guests';

    restService.mergeGuests([JIMMY, GUESTS[2]])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should DELETE /guests correctly', fakeAsync(() => {
    const method = 'DELETE';
    const path = '/guests';

    restService.deleteGuests()
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(null);
  }));

  it('should PUT /guests/<guest_id>/balance correctly', fakeAsync(() => {
    const method = 'PUT';
    const path = '/guests/1/balance';

    restService.addBalance(NORBERT, 3)
      .then((newBalance: number) => {
        expect(newBalance).toBe(10.60);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toBe(requestData[method + path]);
    req.flush(responseData[method + path]);
  }));

  it('should PUT /guests/<guest_id>/bonus correctly', fakeAsync(() => {
    const method = 'PUT';
    const path = '/guests/1/bonus';

    restService.addBonus(NORBERT, 2)
      .then((newBonus: number) => {
        expect(newBonus).toBe(2);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toBe(requestData[method + path]);
    req.flush(responseData[method + path]);
  }));

  it('should PUT /guests/<guest_id>/card correctly', fakeAsync(() => {
    const method = 'PUT';
    const path = '/guests/1/card';

    restService.registerCard(NORBERT, convertCard('12121212'))
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toBe(requestData[method + path]);
    req.flush(null);
  }));

  it('should PUT /guests/<guest_id>/checkin correctly', fakeAsync(() => {
    const method = 'PUT';
    const path = '/guests/1/checkin';

    restService.checkIn(NORBERT)
      .then((checkInDate: Date) => {
        expect(checkInDate).toEqual(new Date(2018, 11, 31, 22, 0));
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should GET /guests/<guest_id>/orders including product data correctly', fakeAsync(() => {
    const method = 'GET';
    const pathProducts = '/products/all';
    const pathOrders = '/guests/1/orders';

    restService.getOrders(NORBERT)
      .then((orders: Order[]) => {
        expect(orders).toEqual([ORDERS[0], ORDERS[2]]);
        resolved = true;
      });

    const reqProducts = httpTestingController.expectOne(restService.apiUrl + pathProducts);
    expect(reqProducts.request.method).toBe(method);
    reqProducts.flush(responseData[method + pathProducts]);

    const reqOrders = httpTestingController.expectOne(restService.apiUrl + pathOrders);
    expect(reqOrders.request.method).toBe(method);
    reqOrders.flush(responseData[method + pathOrders]);
  }));

  it('should GET /statuses correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/statuses';

    restService.getStatuses()
      .then((statuses: Status[]) => {
        expect(statuses).toEqual([DEFAULT, PAID]);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should POST /statuses correctly', fakeAsync(() => {
    const method = 'POST';
    const path = '/statuses';

    restService.mergeStatuses([DEFAULT, PAID])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should DELETE /statuses correctly', fakeAsync(() => {
    const method = 'DELETE';
    const path = '/statuses';

    restService.deleteStatuses([DEFAULT, PAID])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should POST /orders correctly', fakeAsync(() => {
    const method = 'POST';
    const path = '/orders';

    const items = new Map<Product, number>([
      [PEPSI, 1],
      [{
        id: -1,
        name: 'Custom',
        price: 1.70,
        categoryId: null,
        rangeIds: new Set(),
        legacy: false
      }, 1],
      [{
        id: -1,
        name: 'Custom',
        price: 1.10,
        categoryId: null,
        rangeIds: new Set(),
        legacy: false
      }, 1],
      [COCKTAIL, 2],
    ]);

    restService.placeOrder(NORBERT, items)
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should DELETE /orders correctly for item cancellations', fakeAsync(() => {
    const method = 'DELETE';
    const path = '/orders';

    const item = Object.assign({}, ORDERS[0].orderItems[1], { cancelled: 1 });
    restService.cancelOrderItem(item)
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData['ITEM' + method + path]);
    req.flush(null);
  }));

  it('should DELETE /orders correctly for custom cancellations', fakeAsync(() => {
    const method = 'DELETE';
    const path = '/orders';

    const order = Object.assign({}, ORDERS[0], { customCancelled: 0.20 });
    restService.cancelCustom(order)
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData['CUSTOM' + method + path]);
    req.flush(null);
  }));

  it('should GET /statistics correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/statistics';

    restService.getStatistics()
      .then((statistics: Statistics) => {
        expect(statistics).toEqual(STATISTICS);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should GET /users correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/users';

    restService.getUsers()
      .then((users: User[]) => {
        const usersNullPws = JSON.parse(JSON.stringify(USERS));
        for (const user of usersNullPws) {
          user.password = null;
        }
        expect(users).toEqual(usersNullPws);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should POST /users correctly', fakeAsync(() => {
    const method = 'POST';
    const path = '/users';

    restService.mergeUsers([BARKEEPER, RECEPTION])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should DELETE /users correctly', fakeAsync(() => {
    const method = 'DELETE';
    const path = '/users';

    restService.deleteUsers([BARKEEPER, RECEPTION])
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should GET /users/me correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/users/me';

    restService.getUser()
      .then((user: User) => {
        const adminNullPw = Object.assign({}, ADMIN, { password: null });
        expect(user).toEqual(adminNullPw);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should GET /config correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/config';

    restService.getConfig()
      .then((config: Config) => {
        expect(config).toEqual(CONFIG);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    req.flush(responseData[method + path]);
  }));

  it('should PUT /config correctly', fakeAsync(() => {
    const method = 'PUT';
    const path = '/config';

    restService.setConfig(CONFIG)
      .then(() => resolved = true);

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(null);
  }));

  it('should POST /oauth/token correctly', fakeAsync(() => {
    const method = 'POST';
    const path = '/oauth/token';

    restService.authenticate('user', 'pw')
      .then((token: TokenResponse) => {
        expect(token).toEqual(TOKEN);
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    expect(req.request.method).toBe(method);
    expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa('argentum-client:secret'));
    expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded; charset=utf-8');
    expect(req.request.body).toEqual(requestData[method + path]);
    req.flush(responseData[method + path]);
  }));

  it('should handle API usage errors correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/config';

    restService.getConfig()
      .catch((error: string) => {
        expect(error).toBe('You did something wrong.');
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    req.flush(responseData['ERROR' + method + path], { status: 400, statusText: 'NOT_GOOD' });
    tick();
  }));

  it('should handle malformed API usage errors correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/config';

    restService.getConfig()
      .catch((error: string) => {
        expect(error).toBe('You did something wrong.');
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    req.flush(responseData['ERROR' + method + path]);
  }));

  it('should handle invalid token errors correctly', fakeAsync(() => {
    const method = 'GET';
    const path = '/config';

    restService.getConfig()
      .catch((error: string) => {
        expect(error).toBe('Session expired. Redirecting to login.');
        resolved = true;
      });

    const req = httpTestingController.expectOne(restService.apiUrl + path);
    req.flush(responseData['INVALIDTOKEN' + method + path], { status: 401, statusText: 'NOT_GOOD' });
    tick(restService.SESSION_EXPIRED_REDIRECT_TIMEOUT - 1);
    expect(router.navigate).toHaveBeenCalledTimes(0);
    tick(1);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
