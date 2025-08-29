import { expect, test } from '@playwright/test';

test('has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AI Customer Service/);
});

test('shows agent login on initial load', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2')).toContainText('Agent Login');
  await expect(page.locator('h1')).toContainText('AI Customer Service');
});

test('agent login form validation works', async ({ page }) => {
  await page.goto('/');
  
  // Initially button should be disabled because agentName is empty
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  
  // Fill agent name with insufficient characters - should still be disabled
  await page.fill('#agentName', 'J');
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  
  // Fill valid agent name - should enable button (department has default value)
  await page.fill('#agentName', 'John Smith');
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  
  // Clear agent name - should disable again
  await page.fill('#agentName', '');
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
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

test('can start a call from dashboard', async ({ page }) => {
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
  
  // Should see member lookup form with search criteria heading
  await expect(page.locator('h2')).toContainText('Search Criteria');
});

test('member lookup form validation works', async ({ page }) => {
  await page.goto('/');
  
  // Complete login and start call
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Answer Incoming Call")');
  
  // Search button should be disabled initially
  await expect(page.locator('button:has-text("Search Members")')).toBeDisabled();
  
  // Enter single character - should still be disabled
  await page.fill('#lastName', 'S');
  await expect(page.locator('button:has-text("Search Members")')).toBeDisabled();
  
  // Enter valid last name - should be enabled
  await page.fill('#lastName', 'Smith');
  await expect(page.locator('button:has-text("Search Members")')).toBeEnabled();
  
  // Clear form - should be disabled again
  await page.click('button:has-text("Clear Form")');
  await expect(page.locator('button:has-text("Search Members")')).toBeDisabled();
});

test('can search for member with member ID', async ({ page }) => {
  await page.goto('/');
  
  // Complete login flow
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  
  // Start call
  await page.click('button:has-text("Answer Incoming Call")');
  
  // Search by Member ID
  await page.fill('#memberId', 'M123456789');
  
  // Search button should be enabled
  await expect(page.locator('button:has-text("Search Members")')).toBeEnabled();
  
  // Click search button
  await page.click('button:has-text("Search Members")');
  
  // Wait for search results
  await expect(page.locator('.results-section')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.member-card')).toBeVisible();
  await expect(page.locator('h2:has-text("Search Results")')).toBeVisible();
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
  await expect(page.locator('button:has-text("Search Members")')).toBeEnabled();
  
  // Click search button
  await page.click('button:has-text("Search Members")');
  
  // Wait for search results
  await expect(page.locator('.results-section')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.member-card').first()).toBeVisible();
  await expect(page.locator('.results-count')).toContainText('member(s) found');
});

test('can search with multiple criteria', async ({ page }) => {
  await page.goto('/');
  
  // Complete login and start call
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Answer Incoming Call")');
  
  // Fill multiple search fields
  await page.fill('#firstName', 'John');
  await page.fill('#lastName', 'Smith');
  await page.fill('#dateOfBirth', '1980-01-15');
  
  // Search
  await page.click('button:has-text("Search Members")');
  
  // Should see results
  await expect(page.locator('.results-section')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.results-count')).toBeVisible();
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
  await page.click('button:has-text("Search Members")');
  
  // Wait for results and verify we can interact with them
  await expect(page.locator('.member-card').first()).toBeVisible({ timeout: 10000 });
  
  // Just verify that clicking doesn't cause errors and member cards are clickable
  await page.click('.member-card:first-child');
  
  // Give some time for any async operations
  await page.waitForTimeout(1000);
  
  // Verify the member card is still visible (basic interaction test)
  await expect(page.locator('.member-card').first()).toBeVisible();
});

test('member details show complete information', async ({ page }) => {
  await page.goto('/');
  
  // Complete login, start call, search and select member
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Answer Incoming Call")');
  await page.fill('#lastName', 'Smith');
  await page.click('button:has-text("Search Members")');
  await expect(page.locator('.member-card').first()).toBeVisible({ timeout: 10000 });
  await page.click('.member-card:first-child');
  
  // Wait for details section to appear and check content
  await expect(page.locator('.details-section')).toBeVisible({ timeout: 5000 });
  
  // Check member details sections  
  await expect(page.locator('h3:has-text("Personal Information")')).toBeVisible();
  await expect(page.locator('h3:has-text("Contact Information")')).toBeVisible();
  await expect(page.locator('h3:has-text("Address")')).toBeVisible();
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

test('can logout agent from dashboard', async ({ page }) => {
  await page.goto('/');
  
  // Complete login
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  
  // Click logout button - this shows a modal
  await page.click('.btn-logout');
  
  // Modal should appear
  await expect(page.locator('.modal-overlay')).toBeVisible();
  await expect(page.locator('.modal-overlay h3')).toContainText('Confirm Logout');
  
  // Confirm logout
  await page.click('.btn-confirm');
  
  // Should return to login screen
  await expect(page.locator('h2')).toContainText('Agent Login');
  await expect(page.locator('h1')).toContainText('AI Customer Service');
});

test('login form shows security information', async ({ page }) => {
  await page.goto('/');
  
  // Check security elements
  await expect(page.locator('.security-notice h3')).toContainText('Security Reminder');
  await expect(page.locator('.security-notice')).toContainText('Never share your login credentials');
  await expect(page.locator('.security-notice')).toContainText('HIPAA guidelines');
});

test('login form shows system status', async ({ page }) => {
  await page.goto('/');
  
  // Check system status
  await expect(page.locator('.system-status')).toBeVisible();
  await expect(page.locator('.status-indicator.online')).toHaveCount(3);
  await expect(page.locator('.system-status')).toContainText('Call System Online');
  await expect(page.locator('.system-status')).toContainText('Member Database Connected');
  await expect(page.locator('.system-status')).toContainText('Claims System Available');
});

test('search form shows loading state', async ({ page }) => {
  await page.goto('/');
  
  // Complete login and start call
  await page.fill('#agentName', 'Test Agent');
  await page.selectOption('#department', 'customer-service');
  await page.click('button[type="submit"]');
  await page.click('button:has-text("Answer Incoming Call")');
  
  // Fill search form
  await page.fill('#lastName', 'Smith');
  
  // Click search and check for loading state
  await page.click('button:has-text("Search Members")');
  await expect(page.locator('button:has-text("Searching...")')).toBeVisible();
  await expect(page.locator('.loading-icon')).toBeVisible();
});

test('can access different department login options', async ({ page }) => {
  await page.goto('/');
  
  // Check all department options are available
  const departmentSelect = page.locator('#department');
  await expect(departmentSelect.locator('option[value="customer-service"]')).toBeVisible();
  await expect(departmentSelect.locator('option[value="claims"]')).toBeVisible();
  await expect(departmentSelect.locator('option[value="benefits"]')).toBeVisible();
  await expect(departmentSelect.locator('option[value="enrollment"]')).toBeVisible();
  await expect(departmentSelect.locator('option[value="appeals"]')).toBeVisible();
  await expect(departmentSelect.locator('option[value="prior-auth"]')).toBeVisible();
  
  // Test login with different department
  await page.fill('#agentName', 'Claims Agent');
  await page.selectOption('#department', 'claims');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('h2')).toContainText('Claims Agent');
});