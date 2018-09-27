import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { KeypadModalComponent } from './keypad-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';

describe('KeypadModalComponent', () => {
  let component: KeypadModalComponent;
  let fixture: ComponentFixture<KeypadModalComponent>;
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
  let cancel: any;
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

    display = fixture.debugElement.query(By.css('#keypadDisplay')).nativeElement;
    del = fixture.debugElement.query(By.css('#keypadDel')).nativeElement;
    b0 = fixture.debugElement.query(By.css('#keypad0')).nativeElement;
    b1 = fixture.debugElement.query(By.css('#keypad1')).nativeElement;
    b2 = fixture.debugElement.query(By.css('#keypad2')).nativeElement;
    b3 = fixture.debugElement.query(By.css('#keypad3')).nativeElement;
    b4 = fixture.debugElement.query(By.css('#keypad4')).nativeElement;
    b5 = fixture.debugElement.query(By.css('#keypad5')).nativeElement;
    b6 = fixture.debugElement.query(By.css('#keypad6')).nativeElement;
    b7 = fixture.debugElement.query(By.css('#keypad7')).nativeElement;
    b8 = fixture.debugElement.query(By.css('#keypad8')).nativeElement;
    b9 = fixture.debugElement.query(By.css('#keypad9')).nativeElement;
    period = fixture.debugElement.query(By.css('#keypadPeriod')).nativeElement;
    cancel = fixture.debugElement.query(By.css('#keypadCancel')).nativeElement;
    confirm = fixture.debugElement.query(By.css('#keypadConfirm')).nativeElement;

    activeModal = fixture.debugElement.injector.get(NgbActiveModal);
    spyOn(activeModal, 'close');
    spyOn(activeModal, 'dismiss');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have buttons labelled correctly', () => {
    expect(b0.textContent.trim()).toBe('0');
    expect(b1.textContent.trim()).toBe('1');
    expect(b2.textContent.trim()).toBe('2');
    expect(b3.textContent.trim()).toBe('3');
    expect(b4.textContent.trim()).toBe('4');
    expect(b5.textContent.trim()).toBe('5');
    expect(b6.textContent.trim()).toBe('6');
    expect(b7.textContent.trim()).toBe('7');
    expect(b8.textContent.trim()).toBe('8');
    expect(b9.textContent.trim()).toBe('9');
    expect(period.textContent.trim()).toBe('.');
    expect(del.firstElementChild.className).toContain('fa-caret-square-o-left');
    expect(cancel.firstElementChild.className).toContain('fa-close');
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
    expect(component.display).toBe('108.43');
    expect(display.textContent).toBe('108.43');
    component.confirm();
    expect(activeModal.close).toHaveBeenCalledWith(108.43);
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
    expect(component.display).toBe('438.79');
    expect(display.textContent).toBe('438.79');
    component.confirm();
    expect(activeModal.close).toHaveBeenCalledWith(438.79);
  });

  it('should insert a zero if . is pressed first', () => {
    period.click();

    fixture.detectChanges();
    expect(component.display).toBe('0.');
    expect(display.textContent).toBe('0.');
    component.confirm();
    expect(activeModal.close).toHaveBeenCalledWith(0);
  });

  it('should be able to delete characters', () => {
    b1.click();
    period.click();
    b3.click();
    del.click();

    fixture.detectChanges();
    expect(component.display).toBe('1.');
    expect(display.textContent).toBe('1.');
    component.confirm();
    expect(activeModal.close).toHaveBeenCalledWith(1);
  });

  it('should convert an empty display to 0', () => {
    b1.click();
    period.click();
    b3.click();
    del.click();
    del.click();
    del.click();

    fixture.detectChanges();
    expect(component.display).toBe('');
    expect(display.textContent).toBe('');
    component.confirm();
    expect(activeModal.close).toHaveBeenCalledWith(0);
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
    expect(component.display).toBe('131239.8');
    expect(display.textContent).toBe('131239.8');
    component.confirm();
    expect(activeModal.close).toHaveBeenCalledWith(131239.8);
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
    cancel.click();

    fixture.detectChanges();
    expect(activeModal.close).toHaveBeenCalledTimes(0);
    expect(activeModal.dismiss).toHaveBeenCalled();
  });

  it('should detect keyboard strokes if so configured', fakeAsync(() => {
    component.captureKeyboard = true;
    const inputs1 = ['1', '2', '3', '4', '.', '5', '6']
      .map((digit: string) => new KeyboardEvent('keydown', {'key': digit}));
    for (const input of inputs1) {
      document.dispatchEvent(input);
    }
    fixture.detectChanges();
    tick();
    expect(component.display).toBe('1234.56');

    const inputs2 = ['Backspace', 'Backspace', 'Backspace', '7', '8', '9', '0']
      .map((digit: string) => new KeyboardEvent('keydown', {'key': digit}));
    for (const input of inputs2) {
      document.dispatchEvent(input);
    }
    fixture.detectChanges();
    tick();
    expect(component.display).toBe('12347890');

    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
    fixture.detectChanges();
    tick();
    expect(activeModal.close).toHaveBeenCalledWith(12347890);
  }));
});
