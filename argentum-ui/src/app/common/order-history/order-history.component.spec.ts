import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { OrderHistoryComponent } from './order-history.component';
import createSpyObj = jasmine.createSpyObj;
import { RestService } from '../rest-service/rest.service';
import { GUESTS } from '../rest-service/mocks/mock-guests';
import { Guest } from '../model/guest';
import { Order } from '../model/order';
import { OrderItem } from '../model/order-item';
import { COFFEE, COKE, PEPSI } from '../rest-service/mocks/mock-products';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { KeypadModalComponent } from '../keypad-modal/keypad-modal.component';


class ConfirmModalStubComponent {
  message: string;
}

describe('OrderHistoryComponent', () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;

  const restService = createSpyObj('RestService', ['getOrders', 'cancelOrderItem', 'cancelCustom']);
  const modalService = createSpyObj('NgbModal', ['open']);
  const messageComponent = createSpyObj('MessageComponent', ['success']);

  let orders: Order[];

  // Orders are sorted by the component so using indices later won't work.
  let order1: Order;
  let order1item1: OrderItem;
  let order2: Order;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderHistoryComponent],
      providers: [
        { provide: RestService, useValue: restService },
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
        7,
        new Date(2018, 11, 31, 22, 30),
        [
          new OrderItem(11, COKE, 2, 1),
          new OrderItem(12, PEPSI, 1, 0)
        ],
        10.00,
        0
      ),
      new Order(
        23,
        new Date(2018, 11, 31, 22, 45),
        [
          new OrderItem(36, COFFEE, 1, 0)
        ],
        5.50,
        0.50
      )
    ];

    order1 = orders[0];
    order1item1 = orders[0].orderItems[0];
    order2 = orders[1];

    // Reset all spy calls from previous tests.
    for (const spyObj of [restService, modalService, messageComponent]) {
      for (const key in spyObj) {
        if (spyObj.hasOwnProperty(key)) {
          spyObj[key].calls.reset();
        }
      }
    }

    // Shared order history for all tests.
    restService.getOrders.and.callFake((guest: Guest): Promise<Order[]> => {
      if (guest === GUESTS[1]) {
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
    component.getOrderHistory(GUESTS[1]);
    tick();
    fixture.detectChanges();
    expect(component.guest).toBe(GUESTS[1]);
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
    component.getOrderHistory(GUESTS[1]);
    tick();
    component.clear();
    expect(component.guest).toBeNull();
    expect(component.orders).toBeNull();
  }));

  it('should not be able to cancel in view-only mode', fakeAsync(() => {
    component.allowCancel = false;
    component.getOrderHistory(GUESTS[1]);
    tick();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#orderItem11Name')).nativeElement.textContent).toBe('Coke');
    expect(fixture.debugElement.query(By.css('#orderItem11Cancel'))).toBeNull();
  }));

  it('should be able to cancel individual order items', fakeAsync(() => {
    restService.cancelOrderItem.and.returnValue(Promise.resolve());
    component.getOrderHistory(GUESTS[1]);
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

    expect(order1item1.cancelled).toBe(2);
    expect(order1item1.validate()).toBeTruthy();
    expect(order1.validate()).toBeTruthy();
    expect(restService.cancelOrderItem).toHaveBeenCalledWith(order1item1);
  }));

  it('should be able to cancel parts of a custom order', fakeAsync(() => {
    restService.cancelCustom.and.returnValue(Promise.resolve());
    component.getOrderHistory(GUESTS[1]);
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

    expect(order2.customCancelled).toBe(0.60);
    expect(order2.validate()).toBeTruthy();
    expect(restService.cancelCustom).toHaveBeenCalledWith(order2);
  }));
});
