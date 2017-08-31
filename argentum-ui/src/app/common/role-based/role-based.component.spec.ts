import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBasedComponent } from './role-based.component';

describe('RoleBasedComponent', () => {
  let component: RoleBasedComponent;
  let fixture: ComponentFixture<RoleBasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleBasedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleBasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
