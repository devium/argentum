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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assume no roles on empty local storage', () => {
    fixture.detectChanges();
    expect(component.roles).toEqual([]);
  });

  it('should read roles from local storage', () => {
    spyOn(localStorage, 'getItem').and.callFake((item: string) => {
      return item === 'roles' ? 'ADMIN,SCAN,ORDER' : null;
    });
    fixture.detectChanges();
    expect(component.roles).toEqual(['ADMIN', 'SCAN', 'ORDER']);
  });

  it('should properly check for any of the queried roles', () => {
    spyOn(localStorage, 'getItem').and.callFake((item: string) => {
      return item === 'roles' ? 'ADMIN,SCAN,ORDER' : null;
    });
    fixture.detectChanges();
    expect(component.hasRole(['ADMIN'])).toBeTruthy();
    expect(component.hasRole(['SCAN'])).toBeTruthy();
    expect(component.hasRole(['RECEPTION', 'SCAN'])).toBeTruthy();
    expect(component.hasRole(['RECEPTION'])).toBeFalsy();
    expect(component.hasRole(['RECEPTION', 'ALL_RANGES'])).toBeFalsy();
  });
});
