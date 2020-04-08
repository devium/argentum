import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanComponent } from './scan.component';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({selector: 'app-navbar', template: ''})
class NavbarStubComponent {}

@Component({selector: 'app-message', template: ''})
class MessageStubComponent {}

@Component({selector: 'app-card-bar', template: ''})
class CardBarStubComponent {
  @Input()
  fullscreen: boolean;
  @Input()
  message: MessageStubComponent;
}
xdescribe('ScanComponent', () => {
  let component: ScanComponent;
  let cardBarComponent: CardBarStubComponent;
  let fixture: ComponentFixture<ScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScanComponent,
        CardBarStubComponent,
        NavbarStubComponent,
        MessageStubComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanComponent);
    component = fixture.componentInstance;
    cardBarComponent = fixture.debugElement.query(By.directive(CardBarStubComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use a full screen card bar', () => {
    expect(cardBarComponent.fullscreen).toBeTruthy();
  });

  it('should link its message component to the full screen card bar', () => {
    expect(component.message).toBeDefined();
    expect(cardBarComponent.message).toBe(component.message);
  });
});
