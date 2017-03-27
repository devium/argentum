import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGuestsModalComponent } from './delete-guests-modal.component';

describe('DeleteGuestsModalComponent', () => {
  let component: DeleteGuestsModalComponent;
  let fixture: ComponentFixture<DeleteGuestsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteGuestsModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGuestsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
