// tests/accessibility.spec.js - WCAG 2.1 AA Compliance Testing
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Critical pages to test for accessibility
const CRITICAL_PAGES = [
  { url: '/', name: 'Homepage' },
  { url: '/about/', name: 'About Page' },
  { url: '/services/', name: 'Services Page' },
  { url: '/contact/', name: 'Contact Page' },
  { url: '/blog/', name: 'Blog Page' },
  { url: '/faq/', name: 'FAQ Page' }
];

// Test each critical page for accessibility compliance
CRITICAL_PAGES.forEach(({ url, name }) => {
  test.describe(`${name} Accessibility`, () => {
    
    test('should not have any automatically detectable accessibility issues', async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });
    
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(url);
      
      // Should have exactly one H1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // H1 should not be empty
      const h1Text = await page.locator('h1').first().innerText();
      expect(h1Text.trim()).not.toBe('');
      
      // Check heading order (no skipping levels)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      if (headings.length > 1) {
        let prevLevel = 1; // Start with H1
        
        for (let i = 1; i < headings.length; i++) {
          const tagName = await headings[i].evaluate(el => el.tagName);
          const currentLevel = parseInt(tagName.charAt(1));
          
          // Should not skip more than one level
          if (currentLevel > prevLevel) {
            expect(currentLevel - prevLevel).toBeLessThanOrEqual(1);
          }
          
          prevLevel = currentLevel;
        }
      }
    });
    
    test('should have accessible images', async ({ page }) => {
      await page.goto(url);
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        const src = await img.getAttribute('src');
        
        // Images should have alt text or be marked decorative
        if (role !== 'presentation' && role !== 'none') {
          expect(alt).not.toBeNull();
          if (alt === '') {
            console.warn(`Empty alt text for decorative image: ${src}`);
          }
        }
      }
    });
    
    test('should support keyboard navigation', async ({ page }) => {
      await page.goto(url);
      
      // Get all focusable elements
      const focusableElements = page.locator('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      const elementCount = await focusableElements.count();
      
      if (elementCount > 0) {
        // Start tabbing from the beginning
        await page.keyboard.press('Tab');
        
        // Verify focus is visible on first element
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
        
        // Test a few more tab stops
        for (let i = 1; i < Math.min(elementCount, 5); i++) {
          await page.keyboard.press('Tab');
          const currentFocus = page.locator(':focus');
          await expect(currentFocus).toBeVisible();
        }
      }
    });
    
    test('should have proper form accessibility', async ({ page }) => {
      await page.goto(url);
      
      const forms = page.locator('form');
      const formCount = await forms.count();
      
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);
        
        // Check form inputs have labels
        const inputs = form.locator('input:not([type="hidden"]), textarea, select');
        const inputCount = await inputs.count();
        
        for (let j = 0; j < inputCount; j++) {
          const input = inputs.nth(j);
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledby = await input.getAttribute('aria-labelledby');
          
          if (id) {
            // Check for associated label
            const label = form.locator(`label[for="${id}"]`);
            const labelCount = await label.count();
            
            if (labelCount === 0 && !ariaLabel && !ariaLabelledby) {
              const inputType = await input.getAttribute('type');
              throw new Error(`Input of type "${inputType}" with id "${id}" has no associated label`);
            }
          }
        }
      }
    });
    
    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto(url);
      
      const contrastResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include('[data-testid]') // Test specific components if marked
        .analyze();
      
      const contrastViolations = contrastResults.violations.filter(
        violation => violation.id.includes('color-contrast')
      );
      
      expect(contrastViolations).toEqual([]);
    });
  });
});

// Interactive component accessibility tests
test.describe('Interactive Components', () => {
  test('theme toggle should be accessible', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.locator('[data-theme-toggle]');
    await expect(themeToggle).toBeVisible();
    
    // Should have proper ARIA attributes
    const ariaLabel = await themeToggle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    
    // Should be keyboard accessible
    await themeToggle.focus();
    await page.keyboard.press('Enter');
    
    // Wait for theme change
    await page.waitForTimeout(300);
    
    // Should update aria-pressed or similar state
    const ariaPressed = await themeToggle.getAttribute('aria-pressed');
    expect(ariaPressed).toBeTruthy();
  });
  
  test('FAQ accordions should be accessible', async ({ page }) => {
    await page.goto('/faq/');
    
    const accordions = page.locator('[data-accordion-trigger]');
    const accordionCount = await accordions.count();
    
    if (accordionCount > 0) {
      const firstAccordion = accordions.first();
      
      // Should have proper ARIA attributes
      await expect(firstAccordion).toHaveAttribute('aria-expanded');
      await expect(firstAccordion).toHaveAttribute('aria-controls');
      
      // Should be keyboard accessible
      await firstAccordion.focus();
      await page.keyboard.press('Enter');
      
      await expect(firstAccordion).toHaveAttribute('aria-expanded', 'true');
      
      // Content should be accessible
      const contentId = await firstAccordion.getAttribute('aria-controls');
      const content = page.locator(`#${contentId}`);
      await expect(content).toBeVisible();
    }
  });
  
  test('mobile menu should be accessible', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const mobileToggle = page.locator('[aria-label*="menu"]');
    
    if (await mobileToggle.isVisible()) {
      // Should have proper ARIA attributes
      await expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');
      await expect(mobileToggle).toHaveAttribute('aria-controls');
      
      // Should be keyboard accessible
      await mobileToggle.focus();
      await page.keyboard.press('Enter');
      
      await expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');
      
      // Menu should be accessible via Escape
      await page.keyboard.press('Escape');
      await expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');
    }
  });
});

// Dark mode accessibility
test.describe('Theme Accessibility', () => {
  test('should maintain accessibility in dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Switch to dark mode
    const themeToggle = page.locator('[data-theme-toggle]');
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    // Test accessibility in dark mode
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

// Skip link functionality
test.describe('Skip Links', () => {
  test('should have functional skip link', async ({ page }) => {
    await page.goto('/');
    
    // Tab to skip link (should be first focusable element)
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('.skip-link:focus, a[href="#main-content"]:focus');
    
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible();
      
      // Should navigate to main content when clicked
      await skipLink.click();
      
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeFocused();
    }
  });
});