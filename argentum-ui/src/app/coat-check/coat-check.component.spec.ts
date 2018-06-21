import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoatCheckComponent } from './coat-check.component';

describe('CoatCheckComponent', () => {
  let component: CoatCheckComponent;
  let fixture: ComponentFixture<CoatCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoatCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoatCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
