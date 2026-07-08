import { test, expect } from '@playwright/test';

test.describe('Event Discovery', () => {
  test('should display event recommendations', async ({ page }) => {
    await page.goto('/discover');

    // Should show recommended events
    await expect(page.locator('text=Recommended for You')).toBeVisible();
    await expect(page.locator('[class*="event-card"]').first()).toBeVisible();
  });

  test('should filter events by category', async ({ page }) => {
    await page.goto('/discover');

    // Open category filter
    await page.click('button:has-text("All")');

    // Select social category
    await page.click('text=Social');

    // Should filter events
    await expect(page.locator('[class*="event-card"]').first()).toBeVisible();
  });

  test('should search events', async ({ page }) => {
    await page.goto('/discover');

    // Click search
    await page.click('input[placeholder*="Search"]');
    await page.fill('input[placeholder*="Search"]', 'tech meetup');

    // Should show search results
    await expect(page.locator('text=Search Results')).toBeVisible();
  });

  test('should show event details', async ({ page }) => {
    await page.goto('/discover');

    // Click on first event
    await page.locator('[class*="event-card"]').first().click();

    // Should show event details
    await expect(page.locator('[class*="event-title"]')).toBeVisible();
    await expect(page.locator('[class*="event-description"]')).toBeVisible();
    await expect(page.locator('button:has-text("Join")')).toBeVisible();
  });
});

test.describe('Create Event Flow', () => {
  test('should open create event form', async ({ page }) => {
    await page.goto('/events');

    // Click create button
    await page.click('button:has-text("Create Event")');

    // Should show form
    await expect(page.locator('text=Create New Event')).toBeVisible();
    await expect(page.locator('input[placeholder*="Title"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/events/create');

    // Submit without filling required fields
    await page.click('button:has-text("Create")');

    // Should show validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Start date is required')).toBeVisible();
  });

  test('should create event with all fields', async ({ page }) => {
    await page.goto('/events/create');

    // Fill required fields
    await page.fill('input[placeholder*="Title"]', 'Tech Meetup 2024');
    await page.fill('textarea[placeholder*="Description"]', 'A great tech networking event');

    // Set dates
    await page.click('input[placeholder*="Start"]');
    await page.locator('[class*="date-picker"]').first().click();
    await page.locator('button:has-text("Done")').click();

    // Add interests
    await page.click('input[value="tech"]');

    // Submit
    await page.click('button:has-text("Create")');

    // Should show success
    await expect(page.locator('text=Event created successfully')).toBeVisible();
  });

  test('should allow setting event as private', async ({ page }) => {
    await page.goto('/events/create');

    await page.fill('input[placeholder*="Title"]', 'Private Event');
    await page.fill('textarea[placeholder*="Description"]', 'Private party');

    // Set private
    await page.click('text=Private');

    // Submit
    await page.click('button:has-text("Create")');

    // Should create private event
    await expect(page.locator('text=Event created successfully')).toBeVisible();
  });
});

test.describe('Join Event Flow', () => {
  test('should join public event', async ({ page }) => {
    await page.goto('/events/event_123');

    // Click join
    await page.click('button:has-text("Join Event")');

    // Should show confirmation
    await expect(page.locator('text=Confirm Join')).toBeVisible();

    // Confirm
    await page.click('button:has-text("Confirm")');

    // Should update button
    await expect(page.locator('button:has-text("Joined")')).toBeVisible();
  });

  test('should show event capacity warning', async ({ page }) => {
    await page.goto('/events/event_full');

    // Should show full message
    await expect(page.locator('text=Event is full')).toBeVisible();
    await expect(page.locator('button:has-text("Join")')).toBeDisabled();
  });

  test('should add event to calendar', async ({ page }) => {
    await page.goto('/events/event_123');

    // Click add to calendar
    await page.click('button:has-text("Add to Calendar")');

    // Should show calendar options
    await expect(page.locator('text=Add to Calendar')).toBeVisible();
    await expect(page.locator('text=Apple Calendar')).toBeVisible();
    await expect(page.locator('text=Google Calendar')).toBeVisible();
  });

  test('should share event', async ({ page }) => {
    await page.goto('/events/event_123');

    // Click share
    await page.click('button:has-text("Share")');

    // Should show share options
    await expect(page.locator('text=Share Event')).toBeVisible();
  });
});
