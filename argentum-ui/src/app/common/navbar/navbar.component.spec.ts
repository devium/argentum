import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        NgbModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct links', () => {
    fixture.detectChanges();

    component.roles = [];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#navLinks')).children.length).toBe(1);
    expect(fixture.debugElement.query(By.css('#logout')).nativeElement.textContent.trim()).toBe('Logout');

    component.roles = ['ADMIN'];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#navLinks')).children.length).toBe(2);
    expect(fixture.debugElement.query(By.css('#admin')).nativeElement.textContent.trim()).toBe('Admin');

    component.roles = ['ORDER'];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#navLinks')).children.length).toBe(2);
    expect(fixture.debugElement.query(By.css('#order')).nativeElement.textContent.trim()).toBe('Order');

    component.roles = ['TRANSFER'];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#navLinks')).children.length).toBe(2);
    expect(fixture.debugElement.query(By.css('#checkin')).nativeElement.textContent.trim()).toBe('Check-in');

    component.roles = ['CHECKIN'];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#navLinks')).children.length).toBe(2);
    expect(fixture.debugElement.query(By.css('#checkin')).nativeElement.textContent.trim()).toBe('Check-in');

    component.roles = ['SCAN'];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#navLinks')).children.length).toBe(2);
    expect(fixture.debugElement.query(By.css('#scan')).nativeElement.textContent.trim()).toBe('Scan');

    component.roles = ['COAT_CHECK'];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#navLinks')).children.length).toBe(2);
    expect(fixture.debugElement.query(By.css('#coatCheck')).nativeElement.textContent.trim()).toBe('Coat check');

    component.roles = ['TRANSFER', 'CHECKIN', 'SCAN', 'ORDER'];
    fixture.detectChanges();
    // Transfer and checkin share a single site.
    expect(fixture.debugElement.query(By.css('#navLinks')).children.length).toBe(4);
  });
});
