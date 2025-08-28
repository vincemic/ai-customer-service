import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Health Insurance Call Center/);
});

test('member lookup form is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Member Lookup');
});