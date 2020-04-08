import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNavComponent } from './admin-nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
xdescribe('AdminNavComponent', () => {
  let component: AdminNavComponent;
  let fixture: ComponentFixture<AdminNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminNavComponent],
      imports: [
        NgbModule,
        RouterTestingModule.withRoutes([])
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create links for all admin sites', () => {
    expect(fixture.debugElement.query(By.css('#adminLinks')).children.length).toBe(9);
    expect(
      fixture.debugElement.query(By.css('#adminLinks :nth-child(1) > a')).nativeElement.textContent
    ).toBe('Dashboard');
    expect(
      fixture.debugElement.query(By.css('#adminLinks :nth-child(1) > a')).nativeElement.href
    ).toBe(window.location.origin + '/admin/dashboard');
  });
});
