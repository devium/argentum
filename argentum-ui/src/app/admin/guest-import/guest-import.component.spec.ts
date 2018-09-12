import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestImportComponent } from './guest-import.component';

xdescribe('GuestImportComponent', () => {
  let component: GuestImportComponent;
  let fixture: ComponentFixture<GuestImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestImportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
