import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { KeypadModalComponent } from './keypad-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

xdescribe('KeypadModalComponent', () => {
  let component: KeypadModalComponent;
  let fixture: ComponentFixture<KeypadModalComponent>;
  let buttons: DebugElement[];
  let b0: any;
  let b1: any;
  let b2: any;
  let b3: any;
  let b4: any;
  let b5: any;
  let b6: any;
  let b7: any;
  let b8: any;
  let b9: any;
  let del: any;
  let period: any;
  let close: any;
  let confirm: any;

  let display: any;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeypadModalComponent],
      providers: [NgbActiveModal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeypadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    buttons = fixture.debugElement.queryAll(By.css('.btn-primary'));
    del = buttons[0].nativeElement;
    b1 = buttons[1].nativeElement;
    b2 = buttons[2].nativeElement;
    b3 = buttons[3].nativeElement;
    b4 = buttons[4].nativeElement;
    b5 = buttons[5].nativeElement;
    b6 = buttons[6].nativeElement;
    b7 = buttons[7].nativeElement;
    b8 = buttons[8].nativeElement;
    b9 = buttons[9].nativeElement;
    period = buttons[10].nativeElement;
    b0 = buttons[11].nativeElement;
    close = fixture.debugElement.query(By.css('.btn-secondary')).nativeElement;
    confirm = buttons[12].nativeElement;

    display = fixture.debugElement.query(By.css('.form-control.keypad-modal-display')).nativeElement;

    activeModal = fixture.debugElement.injector.get(NgbActiveModal);
    spyOn(activeModal, 'close');
    spyOn(activeModal, 'dismiss');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have buttons labelled correctly', () => {
    expect(b0.textContent).toBe('0');
    expect(b1.textContent).toBe('1');
    expect(b2.textContent).toBe('2');
    expect(b3.textContent).toBe('3');
    expect(b4.textContent).toBe('4');
    expect(b5.textContent).toBe('5');
    expect(b6.textContent).toBe('6');
    expect(b7.textContent).toBe('7');
    expect(b8.textContent).toBe('8');
    expect(b9.textContent).toBe('9');
    expect(period.textContent).toBe('.');
    expect(del.firstElementChild.className).toContain('fa-caret-square-o-left');
    expect(close.firstElementChild.className).toContain('fa-close');
    expect(confirm.firstElementChild.className).toContain('fa-check');
  });

  it('should be able to type a decimal number', () => {
    b1.click();
    b0.click();
    b8.click();
    period.click();
    b4.click();
    b3.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.display).toBe('108.43');
      expect(display.textContent).toBe('108.43');
      component.confirm();
      expect(activeModal.close).toHaveBeenCalledWith(108.43);
    });
  });

  it('should be limited to two decimal places', () => {
    b4.click();
    b3.click();
    b8.click();
    period.click();
    b7.click();
    b9.click();
    b5.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.display).toBe('438.79');
      expect(display.textContent).toBe('438.79');
      component.confirm();
      expect(activeModal.close).toHaveBeenCalledWith(438.79);
    });
  });

  it('should insert a zero if . is pressed first', () => {
    period.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.display).toBe('0.');
      expect(display.textContent).toBe('0.');
      component.confirm();
      expect(activeModal.close).toHaveBeenCalledWith(0);
    });
  });

  it('should be able to delete characters', () => {
    b1.click();
    period.click();
    b3.click();
    del.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.display).toBe('1.');
      expect(display.textContent).toBe('1.');
      component.confirm();
      expect(activeModal.close).toHaveBeenCalledWith(1);
    });
  });

  it('should convert an empty display to 0', () => {
    b1.click();
    period.click();
    b3.click();
    del.click();
    del.click();
    del.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.display).toBe('');
      expect(display.textContent).toBe('');
      component.confirm();
      expect(activeModal.close).toHaveBeenCalledWith(0);
    });
  });

  it('should be limited to 8 characters', () => {
    b1.click();
    b3.click();
    b1.click();
    b2.click();
    b3.click();
    b9.click();
    period.click();
    b8.click();
    b7.click();
    b6.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.display).toBe('131239.8');
      expect(display.textContent).toBe('131239.8');
      component.confirm();
      expect(activeModal.close).toHaveBeenCalledWith(131239.8);
    });
  });

  it('should do nothing on close', () => {
    b1.click();
    b3.click();
    b1.click();
    b9.click();
    period.click();
    b8.click();
    b7.click();
    b6.click();
    close.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(activeModal.close).toHaveBeenCalledTimes(0);
      expect(activeModal.dismiss).toHaveBeenCalled();
    });
  });
});
