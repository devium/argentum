import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { OrderHistoryComponent } from './order-history.component';
import createSpyObj = jasmine.createSpyObj;
import { Guest } from '../model/guest';
import { Order } from '../model/order';
import { OrderItem } from '../model/order-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { KeypadModalComponent } from '../keypad-modal/keypad-modal.component';
import {Guests} from '../rest-service/test-data/guests';
import {Products} from '../rest-service/test-data/products';


class ConfirmModalStubComponent {
  message: string;
}

describe('OrderHistoryComponent', () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;

  let restService: any;
  let modalService: any;
  let messageComponent: any;

  let orders: Order[];

  // Orders are sorted by the component so using indices later won't work.
  let order1: Order;
  let order1item1: OrderItem;
  let order2: Order;

  beforeEach(async(() => {
    restService = createSpyObj('RestService', ['getOrders', 'cancelOrderItem', 'cancelCustom']);
    modalService = createSpyObj('NgbModal', ['open']);
    messageComponent = createSpyObj('MessageComponent', ['success']);
    TestBed.configureTestingModule({
      declarations: [OrderHistoryComponent],
      providers: [
        { provide: NgbModal, useValue: modalService }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    component.allowCancel = true;
    component.message = messageComponent;
    component.modal = false;

    orders = [
      new Order(
        1,
        new Date('2018-12-31T22:30'),
        undefined,
        Guests.ROBY.card,
        1.00,
        0.40,
        false,
        [
          new OrderItem(1, Products.WATER, 2, 1),
          new OrderItem(2, Products.COKE, 1, 1)
        ],
      ),
      new Order(
        2,
        new Date('2018-11-31T22:45'),
        undefined,
        Guests.ROBY.card,
        2.00,
        2.00,
        false,
        [
          new OrderItem(3, Products.COKE, 1, 1)
        ]
      )
    ];

    order1 = orders[0];
    order1item1 = orders[0].orderItems[0];
    order2 = orders[1];

    // Shared order history for all tests.
    restService.getOrders.and.callFake((guest: Guest): Promise<Order[]> => {
      if (guest.equals(Guests.ROBY)) {
        return Promise.resolve(orders);
      } else {
        return Promise.resolve([]);
      }
    });

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly request a guest\'s order history', fakeAsync(() => {
    component.getOrderHistory(Guests.ROBY);
    tick();
    fixture.detectChanges();
    expect(component.guest).toBe(Guests.ROBY);
    expect(component.orders).toEqual(orders);
    expect(
      fixture.debugElement.query(By.css('#orderItem11Quantity > s')).nativeElement.textContent.trim()
    ).toBe('2');
    expect(
      fixture.debugElement.query(By.css('#orderItem11QuantityEffective')).nativeElement.textContent.trim()
    ).toBe('1');
    expect(
      fixture.debugElement.query(By.css('#orderItem11Total > s')).nativeElement.textContent.trim()
    ).toBe('€6.40');
    expect(
      fixture.debugElement.query(By.css('#orderItem11TotalEffective')).nativeElement.textContent.trim()
    ).toBe('€3.20');
    expect(
      fixture.debugElement.query(By.css('#order23CustomTotal > s')).nativeElement.textContent.trim()
    ).toBe('€1.00');
    expect(
      fixture.debugElement.query(By.css('#order23CustomTotalEffective')).nativeElement.textContent.trim()
    ).toBe('€0.50');
  }));

  it('should be able to clear the order list', fakeAsync(() => {
    component.getOrderHistory(Guests.ROBY);
    tick();
    component.clear();
    expect(component.guest).toBeNull();
    expect(component.orders).toBeNull();
  }));

  it('should not be able to cancel in view-only mode', fakeAsync(() => {
    component.allowCancel = false;
    component.getOrderHistory(Guests.ROBY);
    tick();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#orderItem11Name')).nativeElement.textContent).toBe('Coke');
    expect(fixture.debugElement.query(By.css('#orderItem11Cancel'))).toBeNull();
  }));

  it('should be able to cancel individual order items', fakeAsync(() => {
    restService.cancelOrderItem.and.returnValue(Promise.resolve());
    component.getOrderHistory(Guests.ROBY);
    tick();
    fixture.detectChanges();

    // Mock the dialog creation.
    const confirmModalComponent = new ConfirmModalStubComponent();
    modalService.open.and.returnValue({
      componentInstance: confirmModalComponent,
      result: Promise.resolve()
    });

    const cancelButton = fixture.debugElement.query(By.css('#orderItem11Cancel'));
    expect(cancelButton).not.toBeNull();
    cancelButton.nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(modalService.open).toHaveBeenCalledWith(ConfirmModalComponent, { backdrop: 'static' });
    expect(modalService.open.calls.count()).toBe(1);

    // Remove redundant/HTML-ignored whitespace from the message.
    const messageTrimmed = confirmModalComponent.message.replace( /\s+/g, ' ').trim();
    expect(messageTrimmed).toBe(
      'Are you sure you want to refund <b>James the Sunderer</b> with <b>€3.20</b> for one <b>Coke?</b>'
    );
    expect(messageComponent.success.calls.count()).toBe(1);

    const successMessageTrimmed = messageComponent.success.calls.argsFor(0)[0].replace( /\s+/g, ' ').trim();
    expect(successMessageTrimmed).toBe('Refunded <b>James the Sunderer</b> with <b>€3.20</b> for one <b>Coke</b>.');

    expect(order1item1.quantityCurrent).toBe(1);
    expect(restService.cancelOrderItem).toHaveBeenCalledWith(order1item1);
  }));

  it('should be able to cancel parts of a custom order', fakeAsync(() => {
    restService.cancelCustom.and.returnValue(Promise.resolve());
    component.getOrderHistory(Guests.ROBY);
    tick();
    fixture.detectChanges();

    // Mock both dialogs.
    const confirmModalComponent = new ConfirmModalStubComponent();
    modalService.open.and.callFake((content, options) => {
      expect([KeypadModalComponent, ConfirmModalComponent]).toContain(content);
      if (content === KeypadModalComponent) {
        expect(options).toEqual({ backdrop: 'static', size: 'sm' });
        return { result: Promise.resolve(0.10) };
      } else if (content === ConfirmModalComponent) {
        expect(options).toEqual({ backdrop: 'static' });
        return { componentInstance: confirmModalComponent, result: Promise.resolve() };
      }
    });

    const cancelButton = fixture.debugElement.query(By.css('#order23CustomCancel'));
    expect(cancelButton).not.toBeNull();
    cancelButton.nativeElement.click();

    fixture.detectChanges();
    tick();

    // Keypad dialog to enter the cancelled amount, followed by confirmation dialog.
    expect(modalService.open).toHaveBeenCalledWith(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    expect(modalService.open).toHaveBeenCalledWith(ConfirmModalComponent, { backdrop: 'static' });
    expect(modalService.open.calls.count()).toBe(2);

    // Remove redundant/HTML-ignored whitespace from the message.
    const messageTrimmed = confirmModalComponent.message.replace( /\s+/g, ' ').trim();
    expect(messageTrimmed).toBe(
      'Are you sure you want to refund <b>James the Sunderer</b> with <b>€0.10</b> for a custom order?'
    );
    expect(messageComponent.success.calls.count()).toBe(1);

    const successMessageTrimmed = messageComponent.success.calls.argsFor(0)[0].replace( /\s+/g, ' ').trim();
    expect(successMessageTrimmed).toBe('Refunded <b>James the Sunderer</b> with <b>€0.10</b> for a custom order.');

    expect(order2.customCurrent).toBe(0.40);
    expect(restService.cancelCustom).toHaveBeenCalledWith(order2);
  }));
});
