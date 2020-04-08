import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DeleteGuestsModalComponent } from './delete-guests-modal.component';
import createSpyObj = jasmine.createSpyObj;
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
xdescribe('DeleteGuestsModalComponent', () => {
  let component: DeleteGuestsModalComponent;
  let fixture: ComponentFixture<DeleteGuestsModalComponent>;
  let activeModal: any;
  let cancel: any;
  let confirm: any;

  beforeEach(async(() => {
    activeModal = createSpyObj('NgbActiveModal', ['close', 'dismiss']);
    TestBed.configureTestingModule({
      declarations: [DeleteGuestsModalComponent],
      providers: [{ provide: NgbActiveModal, useValue: activeModal }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGuestsModalComponent);
    component = fixture.componentInstance;

    cancel = fixture.debugElement.query(By.css('#deleteGuestsCancel')).nativeElement;
    confirm = fixture.debugElement.query(By.css('#deleteGuestsConfirm')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancel properly', fakeAsync(() => {
    fixture.detectChanges();
    cancel.click();
    expect(activeModal.dismiss).toHaveBeenCalled();
    tick(5000);
  }));

  it('should not be able to confirm for 5 seconds', fakeAsync(() => {
    fixture.detectChanges();
    expect(confirm.disabled).toBeTruthy();
    tick(4999);
    fixture.detectChanges();
    expect(confirm.disabled).toBeTruthy();
    tick(1);
    fixture.detectChanges();
    expect(confirm.disabled).toBeFalsy();

    confirm.click();
    expect(activeModal.close).toHaveBeenCalled();
  }));
});
