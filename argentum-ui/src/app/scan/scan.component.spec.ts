import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanComponent } from './scan.component';
import { Component } from '@angular/core';

@Component({selector: 'app-card-bar', template: ''})
class CardBarStubComponent {}

@Component({selector: 'app-navbar', template: ''})
class NavbarStubComponent {}

@Component({selector: 'app-message', template: ''})
class MessageStubComponent {}

xdescribe('ScanComponent', () => {
  let component: ScanComponent;
  let fixture: ComponentFixture<ScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
