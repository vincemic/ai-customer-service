import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Health Insurance Call Center/);
});

test('shows agent login on initial load', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2')).toContainText('Agent Login');
});

test('can login as agent', async ({ page }) => {
  await page.goto('/');
  
  // Fill out the agent login form
  await page.fill('#agentName', 'John Smith');
  await page.selectOption('#department', 'customer-service');
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Should see agent dashboard with agent name
  await expect(page.locator('h2')).toContainText('John Smith');
  await expect(page.locator('.agent-info')).toBeVisible();
  await expect(page.locator('.session-stats')).toBeVisible();
});

test('can start a call', async ({ page }) => {
  await page.goto('/');
  
  // Login first
  await page.fill('#agentName', 'Jane Doe');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  
  // Wait for dashboard
  await expect(page.locator('h2')).toContainText('Jane Doe');
  
  // Start a call (using "Answer Incoming Call" button)
  await page.click('button:has-text("Answer Incoming Call")');
  
  // Should see fixed call header
  await expect(page.locator('.call-header-fixed')).toBeVisible();
  
  // Should see member lookup form
  await expect(page.locator('h1')).toContainText('Member Lookup');
});

test('can search for member with last name only', async ({ page }) => {
  await page.goto('/');
  
  // Complete login flow
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  
  // Start call
  await page.click('button:has-text("Answer Incoming Call")');
  
  // Fill out the member lookup form (last name only)
  await page.fill('#lastName', 'Smith');
  
  // Search button should be enabled
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  
  // Click search button
  await page.click('button[type="submit"]');
  
  // Wait for search results
  await expect(page.locator('.search-results')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.member-result')).toBeVisible();
});

test('can select member from search results', async ({ page }) => {
  await page.goto('/');
  
  // Complete login and start call
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Answer Incoming Call")');
  
  // Search for members
  await page.fill('#lastName', 'Smith');
  await page.click('button[type="submit"]');
  
  // Wait for results and select first member
  await expect(page.locator('.member-result')).toBeVisible({ timeout: 10000 });
  await page.click('.member-result:first-child');
  
  // Should see selected member details
  await expect(page.locator('.selected-member')).toBeVisible();
  await expect(page.locator('.selected-member h2')).toContainText('Selected Member');
});

test('fixed call header shows call controls', async ({ page }) => {
  await page.goto('/');
  
  // Complete login and start call
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Answer Incoming Call")');
  
  // Check fixed header elements
  await expect(page.locator('.call-header-fixed')).toBeVisible();
  await expect(page.locator('.call-controls')).toBeVisible();
  await expect(page.locator('.control-btn.end-call-btn')).toBeVisible();
  await expect(page.locator('.member-status.pending')).toBeVisible();
});

test('can end call from fixed header', async ({ page }) => {
  await page.goto('/');
  
  // Complete login and start call
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Answer Incoming Call")');
  
  // End call from header
  await page.click('.control-btn.end-call-btn');
  
  // Should return to dashboard
  await expect(page.locator('h2')).toContainText('Test Agent');
  await expect(page.locator('.call-header-fixed')).not.toBeVisible();
});

test('can logout agent', async ({ page }) => {
  await page.goto('/');
  
  // Complete login
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  
  // Logout
  await page.click('button:has-text("Logout")');
  
  // Should return to login screen
  await expect(page.locator('h2')).toContainText('Agent Login');
});

test('member lookup form validation works', async ({ page }) => {
  await page.goto('/');
  
  // Complete login and start call
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Answer Incoming Call")');
  
  // Search button should be disabled initially
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  
  // Enter single character - should still be disabled
  await page.fill('#lastName', 'S');
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  
  // Enter valid last name - should be enabled
  await page.fill('#lastName', 'Smith');
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  
  // Clear form - should be disabled again
  await page.click('button:has-text("Clear")');
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
});