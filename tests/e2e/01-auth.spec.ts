import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login screen', async ({ page }) => {
    await expect(page.locator('text=Welcome to LinkUp')).toBeVisible();
    await expect(page.locator('button:has-text("Login with Telegram")')).toBeVisible();
  });

  test('should show loading state during authentication', async ({ page }) => {
    // Click login button
    await page.click('button:has-text("Login with Telegram")');

    // Should show loading
    await expect(page.locator('text=Connecting...')).toBeVisible();
  });

  test('should handle successful Telegram login', async ({ page }) => {
    // Mock Telegram authentication
    await page.evaluate(() => {
      // Mock successful auth response
      window.postMessage({
        type: 'TELEGRAM_AUTH',
        authResult: {
          id: 123456789,
          first_name: 'Test',
          username: 'testuser',
        },
      }, '*');
    });

    // Wait for redirect to app
    await page.waitForURL(/\/(home|discover)/);
  });

  test('should handle authentication errors', async ({ page }) => {
    // Trigger error state
    await page.evaluate(() => {
      window.postMessage({
        type: 'TELEGRAM_AUTH_ERROR',
        error: 'Authentication failed',
      }, '*');
    });

    await expect(page.locator('text=Authentication failed')).toBeVisible();
  });
});

test.describe('Onboarding Flow', () => {
  test('should guide user through onboarding', async ({ page }) => {
    // Assume user is authenticated
    await page.goto('/onboarding');

    // Step 1: Language selection
    await expect(page.locator('text=Choose your language')).toBeVisible();
    await page.click('button:has-text("English")');
    await page.click('button:has-text("Continue")');

    // Step 2: Interests selection
    await expect(page.locator('text=What interests you?')).toBeVisible();
    await page.click('input[value="social"]');
    await page.click('button:has-text("Continue")');

    // Step 3: Location permission
    await expect(page.locator('text=Enable location')).toBeVisible();

    // Grant permission
    await page.context().grantPermissions(['geolocation']);
    await page.click('button:has-text("Enable")');

    // Complete
    await expect(page.locator('text=You\'re all set!')).toBeVisible();
  });

  test('should skip optional steps', async ({ page }) => {
    await page.goto('/onboarding');

    // Skip location
    await page.click('button:has-text("Enable")');
    await page.click('button:has-text("Skip")');

    // Should proceed
    await expect(page.locator('text=You\'re all set!')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate between tabs', async ({ page }) => {
    await page.goto('/home');

    // Navigate to Discover
    await page.click('text=Discover');
    await expect(page).toHaveURL(/\/discover/);

    // Navigate to Events
    await page.click('text=Events');
    await expect(page).toHaveURL(/\/events/);

    // Navigate to Chat
    await page.click('text=Chat');
    await expect(page).toHaveURL(/\/chat/);

    // Navigate to Profile
    await page.click('text=Profile');
    await expect(page).toHaveURL(/\/profile/);
  });

  test('should show tab badges', async ({ page }) => {
    await page.goto('/home');

    // Should show notification badge
    const badge = page.locator('[class*="badge"]').first();
    await expect(badge).toBeVisible();
  });
});
