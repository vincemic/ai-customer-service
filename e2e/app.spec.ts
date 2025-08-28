import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Health Insurance Call Center/);
});

test('call session is active on load', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2')).toContainText('Active Call Session');
});

test('member lookup form is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Member Lookup');
});

test('can search for member', async ({ page }) => {
  await page.goto('/');
  
  // Fill out the member lookup form
  await page.fill('#lastName', 'Doe');
  await page.fill('#dateOfBirth', '1985-06-15');
  
  // Click search button
  await page.click('button[type="submit"]');
  
  // Wait for search results
  await expect(page.locator('.member-found')).toBeVisible({ timeout: 10000 });
});