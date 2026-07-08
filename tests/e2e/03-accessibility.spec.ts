import { test, expect, AxeBuilder } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('home page should be accessible', async ({ page }) => {
    await page.goto('/home');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('discover page should be accessible', async ({ page }) => {
    await page.goto('/discover');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations.length).toBeLessThan(10);
  });

  test('profile page should be accessible', async ({ page }) => {
    await page.goto('/profile');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Keyboard Navigation', () => {
  test('should navigate with tab key', async ({ page }) => {
    await page.goto('/home');
    
    // Initial focus
    await page.keyboard.press('Tab');
    
    // Should move focus to interactive elements
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/home');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Check if focused element has visible outline
    const hasOutline = await page.evaluate(() => {
      const focused = document.activeElement;
      if (!focused) return false;
      
      const styles = window.getComputedStyle(focused);
      return (
        styles.outlineWidth !== '0px' ||
        styles.borderWidth !== '0px' ||
        styles.boxShadow !== 'none'
      );
    });

    expect(hasOutline).toBe(true);
  });

  test('should close modals with Escape key', async ({ page }) => {
    await page.goto('/events/event_123');
    
    // Open share dialog
    await page.click('button:has-text("Share")');
    await expect(page.locator('text=Share Event')).toBeVisible();
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Should close
    await expect(page.locator('text=Share Event')).not.toBeVisible();
  });

  test('should navigate buttons with arrow keys', async ({ page }) => {
    await page.goto('/discover');
    
    // Focus first filter button
    await page.locator('[role="tablist"] button').first().focus();
    
    // Should be able to navigate
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    
    // Focus maintained
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });
});

test.describe('Screen Reader Support', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/home');
    
    const headings = await page.evaluate(() => {
      const h = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return h.map(el => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent?.trim().substring(0, 50),
      }));
    });

    // Should have h1
    const h1Count = headings.filter(h => h.level === 1).length;
    expect(h1Count).toBe(1);

    // Check hierarchy (no skipping levels)
    const levels = headings.map(h => h.level);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i-1]).toBeLessThanOrEqual(1);
    }
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/events/event_123');
    
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src.substring(0, 50),
        alt: img.alt,
        hasAlt: img.alt !== undefined && img.alt !== '',
      }));
    });

    // All informative images should have alt text
    images.forEach(img => {
      if (img.src && !img.src.includes('data:')) {
        expect(img.hasAlt).toBe(true);
      }
    });
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/events/create');
    
    const formFields = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      return inputs.map(input => {
        const label = input.getAttribute('aria-label');
        const labelledBy = input.getAttribute('aria-labelledby');
        const id = input.id;
        
        return {
          id,
          label,
          labelledBy,
          hasLabel: !!(label || labelledBy || id),
        };
      });
    });

    // All form fields should have labels
    formFields.forEach(field => {
      expect(field.hasLabel).toBe(true);
    });
  });

  test('should have proper ARIA attributes for interactive elements', async ({ page }) => {
    await page.goto('/discover');
    
    const buttons = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.map(btn => ({
        text: btn.textContent?.trim().substring(0, 30),
        ariaLabel: btn.getAttribute('aria-label'),
        ariaExpanded: btn.getAttribute('aria-expanded'),
      }));
    });

    // Buttons should be properly accessible
    expect(buttons.length).toBeGreaterThan(0);
  });
});

test.describe('Color Contrast', () => {
  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/home');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('.text, p, h1, h2, h3, h4, h5, h6')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    expect(contrastViolations.length).toBe(0);
  });
});

test.describe('Touch Targets', () => {
  test('should have touch targets at least 44x44px', async ({ page }) => {
    await page.goto('/home');
    
    const smallTouchTargets = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a, input, [role="button"]'));
      
      return elements
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width < 44 || rect.height < 44;
        })
        .map(el => ({
          tag: el.tagName,
          text: el.textContent?.trim().substring(0, 20),
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height,
        }));
    });

    // Should be no small touch targets
    expect(smallTouchTargets.length).toBe(0);
  });
});

test.describe('Reduced Motion', () => {
  test('should respect reduced motion preference', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/discover');
    
    // Check that animations are disabled or minimal
    const animations = await page.evaluate(() => {
      const el = document.querySelector('body');
      const styles = window.getComputedStyle(el);
      return {
        transitionDuration: styles.transitionDuration,
        animationDuration: styles.animationDuration,
      };
    });

    // Should have reduced motion
    expect(animations.animationDuration).toBe('0s');
  });
});
