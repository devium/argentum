import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        NgbModule,
        RouterTestingModule.withRoutes([])
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the correct links', () => {
    spyOn(component, 'refreshLinks').and.callThrough();
    fixture.detectChanges();
    expect(component.refreshLinks).toHaveBeenCalled();

    const links = fixture.debugElement.query(By.css('#navLinks'));

    component.groupNames = [];
    component.refreshLinks();
    fixture.detectChanges();
    expect(links.children.length).toBe(1, 'Logout');
    expect(links.children[0].nativeElement.textContent.trim()).toBe('Logout');

    component.groupNames = ['admin'];
    component.refreshLinks();
    fixture.detectChanges();
    expect(links.children.length).toBe(2, 'Admin & Logout');
    expect(links.children[0].nativeElement.textContent.trim()).toBe('Admin');

    component.groupNames = ['order'];
    component.refreshLinks();
    fixture.detectChanges();
    expect(links.children.length).toBe(2, 'Order & Logout');
    expect(links.children[0].nativeElement.textContent.trim()).toBe('Order');

    component.groupNames = ['transfer'];
    component.refreshLinks();
    fixture.detectChanges();
    expect(links.children.length).toBe(2, 'Check-in (Transfer) & Logout');
    expect(links.children[0].nativeElement.textContent.trim()).toBe('Check-in');

    component.groupNames = ['checkin'];
    component.refreshLinks();
    fixture.detectChanges();
    expect(links.children.length).toBe(2, 'Check-in (Check-in) & Logout');
    expect(links.children[0].nativeElement.textContent.trim()).toBe('Check-in');

    component.groupNames = ['scan'];
    component.refreshLinks();
    fixture.detectChanges();
    expect(links.children.length).toBe(2, 'Scan & Logout');
    expect(links.children[0].nativeElement.textContent.trim()).toBe('Scan');

    // component.groupNames = ['coat_check'];
    // component.refreshLinks();
    // fixture.detectChanges();
    // expect(links.children.length).toBe(2, 'Coat check & Logout');
    // expect(links.children[0].nativeElement.textContent.trim()).toBe('Coat check');

    component.groupNames = ['transfer', 'checkin', 'scan', 'order'];
    component.refreshLinks();
    fixture.detectChanges();
    // Transfer and checkin share a single site.
    expect(links.children.length).toBe(4, 'Check-in & Order & Scan & Logout');
  });
});
