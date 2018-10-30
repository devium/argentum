import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NewGuestModalComponent } from './new-guest-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import createSpyObj = jasmine.createSpyObj;
import { RestService } from '../../common/rest-service/rest.service';
import { STATUSES } from '../../common/rest-service/mocks/mock-statuses';

describe('NewGuestModalComponent', () => {
  let component: NewGuestModalComponent;
  let fixture: ComponentFixture<NewGuestModalComponent>;
  let restService: any;
  let activeModal: any;

  beforeEach(async(() => {
    restService = createSpyObj('RestService', ['getStatuses']);
    activeModal = createSpyObj('NgbActiveModal', ['close', 'dismiss']);
    TestBed.configureTestingModule({
      declarations: [NewGuestModalComponent],
      providers: [
        { provide: RestService, useValue: restService },
        { provide: NgbActiveModal, useValue: activeModal }
      ],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGuestModalComponent);
    component = fixture.componentInstance;
    restService.getStatuses.and.returnValue(Promise.resolve(STATUSES));
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));
});
