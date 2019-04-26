import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CardBarComponent } from './card-bar.component';
import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import createSpyObj = jasmine.createSpyObj;
import { MessageComponent } from '../message/message.component';
import createSpy = jasmine.createSpy;
import {Guests} from '../rest-service/test-data/guests';
import {Statuses} from '../rest-service/test-data/statuses';

@Component({selector: 'app-order-history', template: ''})
class OrderHistoryStubComponent {
  @Input()
  message: MessageStubComponent;
}

@Component({selector: 'app-message', template: ''})
class MessageStubComponent {}

describe('CardBarComponent bar mode', () => {
  let component: CardBarComponent;
  let fixture: ComponentFixture<CardBarComponent>;
  const restService = createSpyObj('RestService', ['getGuestByCard', 'getStatuses']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CardBarComponent,
        OrderHistoryStubComponent
      ],
      providers: [
      ],
      imports: [BrowserAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBarComponent);
    component = fixture.componentInstance;
    component.fullscreen = false;
    restService.getGuestByCard.and.callFake((card: string) => Promise.resolve(
      Guests.ALL.find(guest => guest.card === card)
    ));
    restService.getStatuses.and.returnValue(Promise.resolve(Statuses.ALL));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not have an order history component', () => {
    fixture.detectChanges();
    expect(component.orderHistory).toBeUndefined();
  });

  it('should initialize members correctly', fakeAsync(() => {
    // Note: detectChanges() must be called within this fakeAsync zone for the first time or promises within ngOnInit
    // cannot be resolved by tick().
    fixture.detectChanges();
    tick();

    expect(component.card).toBe('');
    expect(component.guest).toBeNull();
    expect(component.status).toBeNull();
    expect(component.active).toBeTruthy();
    expect(component.state).toBe(component.scanState.Waiting);
    expect(component.statuses).toBe(Statuses.ALL);
    expect(fixture.debugElement.query(By.css('#stateWaiting')).nativeElement.textContent).toBe('Ready for scan.');
    expect(fixture.debugElement.query(By.css('#stateValid'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#stateNotFound'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#card')).nativeElement.textContent.trim()).toBe('');
    expect(fixture.debugElement.query(By.css('#status'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#balance'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#bonus'))).toBeNull();
  }));

  it('should register keystrokes in batches', fakeAsync(() => {
    fixture.detectChanges();
    const newNumberSpy = spyOn(component, 'newNumber').and.callThrough();

    const inputs = [
      new KeyboardEvent('keydown', {'key': '3'}),
      new KeyboardEvent('keydown', {'key': '7'}),
      new KeyboardEvent('keydown', {'key': '6'})
    ];

    // Slow typing. Individual numbers registered.
    for (const input of inputs) {
      document.dispatchEvent(input);
      tick(component.flushInputTimeout + 10);
    }
    expect(newNumberSpy.calls.allArgs()).toEqual([['3'], ['7'], ['6']]);

    // Fast typing. Registered as a single number.
    for (const input of inputs) {
      document.dispatchEvent(input);
      tick(10);
    }
    tick(component.flushInputTimeout);

    expect(newNumberSpy).toHaveBeenCalledWith('376');
    expect(newNumberSpy).toHaveBeenCalledTimes(4);

    tick(component.cardTimeout);
  }));

  it('should ignore non-numerical input', fakeAsync(() => {
    fixture.detectChanges();
    const newNumberSpy = spyOn(component, 'newNumber').and.callThrough();

    const inputs = [
      new KeyboardEvent('keydown', {'key': '-'}),
      new KeyboardEvent('keydown', {'key': '3'}),
      new KeyboardEvent('keydown', {'key': 'a'}),
      new KeyboardEvent('keydown', {'key': '/'}),
      new KeyboardEvent('keydown', {'key': '7'}),
      new KeyboardEvent('keydown', {'key': '6'})
    ];

    for (const input of inputs) {
      document.dispatchEvent(input);
      tick(10);
    }
    tick(component.flushInputTimeout);

    expect(newNumberSpy).toHaveBeenCalledWith('376');
    expect(newNumberSpy).toHaveBeenCalledTimes(1);

    tick(component.cardTimeout);
  }));

  it('should display and reset card values properly (no valid number)', fakeAsync(() => {
    fixture.detectChanges();
    const inputs = [
      new KeyboardEvent('keydown', {'key': '3'}),
      new KeyboardEvent('keydown', {'key': '7'}),
      new KeyboardEvent('keydown', {'key': '6'})
    ];

    for (const input of inputs) {
      document.dispatchEvent(input);
      tick(10);
    }
    tick(component.flushInputTimeout);

    fixture.detectChanges();
    expect(component.card).toBe('376');
    expect(component.guest).toBeNull();

    expect(fixture.debugElement.query(By.css('#stateWaiting'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#stateValid'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#stateNotFound')).nativeElement.textContent).toBe(
      'Card number not found.'
    );
    expect(fixture.debugElement.query(By.css('#card')).nativeElement.textContent.trim()).toBe('376');
    expect(fixture.debugElement.query(By.css('#balance'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#bonus'))).toBeNull();

    tick(component.cardTimeout);

    fixture.detectChanges();
    expect(component.card).toBe('');
    expect(component.guest).toBeNull();

    expect(fixture.debugElement.query(By.css('#stateWaiting')).nativeElement.textContent).toBe('Ready for scan.');
    expect(fixture.debugElement.query(By.css('#stateValid'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#stateNotFound'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#card')).nativeElement.textContent.trim()).toBe('');
    expect(fixture.debugElement.query(By.css('#status'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#balance'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#bonus'))).toBeNull();
  }));

  it('should display and reset card values properly (registered guest)', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const inputs = '12341234'.split('').map((digit: string) => new KeyboardEvent('keydown', {'key': digit}));

    for (const input of inputs) {
      document.dispatchEvent(input);
      tick(10);
    }
    tick(component.flushInputTimeout);

    fixture.detectChanges();
    expect(component.card).toBe('8102162');
    expect(component.guest.id).toBe(2);

    expect(fixture.debugElement.query(By.css('#stateWaiting'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#stateValid')).nativeElement.textContent.trim()).toBe(
      'James the Sunderer'
    );
    expect(fixture.debugElement.query(By.css('#stateNotFound'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#card')).nativeElement.textContent.trim()).toBe('8102162');
    expect(fixture.debugElement.query(By.css('#status')).nativeElement.textContent.trim()).toBe('Default');
    expect(fixture.debugElement.query(By.css('#balance')).nativeElement.textContent.trim()).toBe('€10.00');
    expect(fixture.debugElement.query(By.css('#bonus')).nativeElement.textContent.trim()).toBe('+ €5.00');

    tick(component.cardTimeout);

    fixture.detectChanges();
    expect(component.card).toBe('');
    expect(component.guest).toBeNull();

    expect(fixture.debugElement.query(By.css('#stateWaiting')).nativeElement.textContent).toBe('Ready for scan.');
    expect(fixture.debugElement.query(By.css('#stateValid'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#stateNotFound'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#status'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#balance'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#bonus'))).toBeNull();
  }));

  it('should display internal status name if status cannot be found', fakeAsync(() => {
    restService.getStatuses.and.returnValue(Promise.resolve([]));
    fixture.detectChanges();
    tick();

    const inputs = '12341234'.split('').map((digit: string) => new KeyboardEvent('keydown', {'key': digit}));

    for (const input of inputs) {
      document.dispatchEvent(input);
      tick(10);
    }
    tick(component.flushInputTimeout);

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#status')).nativeElement.textContent.trim()).toBe('default');
    tick(component.cardTimeout);
  }));

  it('should ignore scans while disabled', fakeAsync(() => {
    fixture.detectChanges();
    component.active = false;
    const inputs = [
      new KeyboardEvent('keydown', {'key': '3'}),
      new KeyboardEvent('keydown', {'key': '7'}),
      new KeyboardEvent('keydown', {'key': '6'})
    ];

    for (const input of inputs) {
      document.dispatchEvent(input);
      tick(10);
    }
    tick(component.flushInputTimeout);

    fixture.detectChanges();

    expect(component.card).toBe('');
    expect(component.guest).toBeNull();
    expect(component.state).toBe(component.scanState.Waiting);

    component.active = true;

    for (const input of inputs) {
      document.dispatchEvent(input);
      tick(10);
    }
    tick(component.flushInputTimeout);

    fixture.detectChanges();

    expect(component.card).toBe('376');
    expect(component.guest).toBeNull();
    expect(component.state).toBe(component.scanState.NotFound);

    tick(component.cardTimeout);
  }));
});

describe('CardBarComponent fullscreen mode', () => {
  let component: CardBarComponent;
  let messageComponent: MessageStubComponent;
  let fixture: ComponentFixture<CardBarComponent>;
  const restService = createSpyObj('RestService', ['getGuestByCard', 'getStatuses']);
  restService.getGuestByCard.and.callFake((card: string) => Promise.resolve(Guests.ALL.find(guest => guest.card === card)));
  restService.getStatuses.and.returnValue(Promise.resolve(Statuses.ALL));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CardBarComponent,
        MessageStubComponent,
        OrderHistoryStubComponent,
      ],
      providers: [
      ],
      imports: [BrowserAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    messageComponent = TestBed.createComponent(MessageStubComponent).componentInstance;
    fixture = TestBed.createComponent(CardBarComponent);
    component = fixture.componentInstance;
    component.fullscreen = true;
    component.message = messageComponent as MessageComponent;

    restService.getGuestByCard.and.callFake((card: string) => Promise.resolve(
      Guests.ALL.find(guest => guest.card === card)
    ));
    restService.getStatuses.and.returnValue(Promise.resolve(Statuses.ALL));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have order history and message components properly linked', () => {
    fixture.detectChanges();
    const orderHistoryComponent = fixture.debugElement.query(By.directive(OrderHistoryStubComponent)).componentInstance;
    expect(component.orderHistory).toBeDefined();
    expect(component.message).toBeDefined();
    expect(orderHistoryComponent.message).toBe(component.message);
  });

  it('should trigger an order history request on scan', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const orderHistoryComponent = fixture.debugElement.query(By.directive(OrderHistoryStubComponent)).componentInstance;
    orderHistoryComponent.clear = createSpy('clear');
    orderHistoryComponent.getOrderHistory = createSpy('getOrderHistory');

    const inputs = '12341234'.split('').map((digit: string) => new KeyboardEvent('keydown', {'key': digit}));

    for (const input of inputs) {
      document.dispatchEvent(input);
      tick(10);
    }
    tick(component.flushInputTimeout);

    expect(orderHistoryComponent.clear).not.toHaveBeenCalled();
    expect(orderHistoryComponent.getOrderHistory).toHaveBeenCalledWith(Guests.ALL[1]);

    document.dispatchEvent(new KeyboardEvent('keydown', {'key': '5'}));
    tick(component.flushInputTimeout);

    expect(orderHistoryComponent.clear).toHaveBeenCalled();
    tick(component.cardTimeout);
  }));
});
