import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {HasRoleDirective} from './has-role.directive';

// Create a test component that uses the directive
@Component({
    standalone: true,
    imports: [HasRoleDirective],
    template: `
    <div *appHasRole="requiredRole" id="protected-content">
      Protected Content
    </div>
  `
})
class TestComponent {
    requiredRole: string | string[] = 'ADMIN';
}

describe('HasRoleDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let protectedElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HasRoleDirective, TestComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        // Clean up localStorage after each test
        localStorage.clear();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should show content when user has required role', () => {
        localStorage.setItem('userRole', 'ADMIN');
        component.requiredRole = ['ADMIN'];

        // Trigger change detection
        fixture.detectChanges();

        // Check if content is visible
        protectedElement = fixture.debugElement.query(By.css('#protected-content'));
        expect(protectedElement).toBeTruthy();
        expect(protectedElement.nativeElement.textContent.trim()).toBe('Protected Content');
    });

    it('should hide content when user does not have required role', () => {
        // Set different user role
        component.requiredRole = ['USER'];
        fixture.detectChanges();

        // Check if content is hidden
        protectedElement = fixture.debugElement.query(By.css('#protected-content'));
        expect(protectedElement).toBeFalsy();
    });

    it('should hide content when no user role is set', () => {
        // Don't set any role in localStorage
        component.requiredRole = [];
        fixture.detectChanges();

        protectedElement = fixture.debugElement.query(By.css('#protected-content'));
        expect(protectedElement).toBeFalsy();
    });

    it('should show content when user has one of the required roles (array)', () => {
        localStorage.setItem('userRole', 'TEAM_MANAGER');

        // Set multiple allowed roles
        component.requiredRole = ['ADMIN', 'TEAM_MANAGER'];
        fixture.detectChanges();

        protectedElement = fixture.debugElement.query(By.css('#protected-content'));
        expect(protectedElement).toBeTruthy();
    });

    it('should hide content when user role is not in the required roles array', () => {
        localStorage.setItem('userRole', 'USER');

        component.requiredRole = ['ADMIN', 'TEAM_MANAGER'];
        fixture.detectChanges();

        protectedElement = fixture.debugElement.query(By.css('#protected-content'));
        expect(protectedElement).toBeFalsy();
    });

    it('should be case insensitive for role comparison', () => {
        localStorage.setItem('userRole', 'admin');
        component.requiredRole = ['ADMIN']; // uppercase in directive
        fixture.detectChanges();

        protectedElement = fixture.debugElement.query(By.css('#protected-content'));
        expect(protectedElement).toBeTruthy();
    });

    it('should update view when role changes', () => {
        // Start with USER role
        localStorage.setItem('userRole', 'ADMIN');
        component.requiredRole = ['USER'];
        fixture.detectChanges();

        protectedElement = fixture.debugElement.query(By.css('#protected-content'));
        expect(protectedElement).toBeFalsy();

        // Change to ADMIN role
        component.requiredRole = ['ADMIN'];
        fixture.detectChanges();

        protectedElement = fixture.debugElement.query(By.css('#protected-content'));
        expect(protectedElement).toBeTruthy();
    });
});