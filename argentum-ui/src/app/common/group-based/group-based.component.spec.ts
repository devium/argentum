import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBasedComponent } from './group-based.component';

describe('GroupBasedComponent', () => {
  let component: GroupBasedComponent;
  let fixture: ComponentFixture<GroupBasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBasedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBasedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assume no groups on empty local storage', () => {
    fixture.detectChanges();
    expect(component.groupNames).toEqual([]);
  });

  it('should read groups from local storage', () => {
    spyOn(localStorage, 'getItem').and.callFake((item: string) => {
      return item === 'groups' ? 'admin,scan,order-panels' : null;
    });
    fixture.detectChanges();
    expect(component.groupNames).toEqual(['admin', 'scan', 'order']);
  });

  it('should properly check for any of the queried groups', () => {
    spyOn(localStorage, 'getItem').and.callFake((item: string) => {
      return item === 'groups' ? 'admin,scan,order-panels' : null;
    });
    fixture.detectChanges();
    expect(component.hasGroup(['admin'])).toBeTruthy();
    expect(component.hasGroup(['scan'])).toBeTruthy();
    expect(component.hasGroup(['check_in', 'scan'])).toBeTruthy();
    expect(component.hasGroup(['check_in'])).toBeFalsy();
    expect(component.hasGroup(['check_in', 'product_range_all'])).toBeFalsy();
  });
});
