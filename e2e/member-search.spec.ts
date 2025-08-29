import { expect, test } from '@playwright/test';

test.describe('Member Search and Selection', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login and start a call
    await page.goto('/');
    await page.fill('#agentName', 'Search Test Agent');
    await page.selectOption('#department', 'customer-service');
    await page.click('button[type="submit"]');
    await page.click('button:has-text("Answer Incoming Call")');
  });

  test('member ID search takes priority over other fields', async ({ page }) => {
    // Fill both Member ID and other fields
    await page.fill('#memberId', 'M123456789');
    await page.fill('#lastName', 'Different');
    await page.fill('#firstName', 'Person');
    
    await page.click('button:has-text("Search Members")');
    
    // Should find the member with the ID, not the name
    await expect(page.locator('.results-section')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.member-card')).toBeVisible();
    
    // Check that the result contains the searched Member ID
    await expect(page.locator('.member-id')).toContainText('M123456789');
  });

  test('validates member ID format', async ({ page }) => {
    // Enter invalid Member ID format
    await page.fill('#memberId', 'invalid-id');
    
    // Should show validation error
    await expect(page.locator('.error-message')).toContainText('Please enter a valid Member ID');
  });

  test('validates required last name field', async ({ page }) => {
    // Try to search without required last name
    await page.fill('#firstName', 'John');
    
    // Search button should be disabled
    await expect(page.locator('button:has-text("Search Members")')).toBeDisabled();
    
    // Fill last name with insufficient characters
    await page.fill('#lastName', 'S');
    await expect(page.locator('button:has-text("Search Members")')).toBeDisabled();
    
    // Fill valid last name
    await page.fill('#lastName', 'Smith');
    await expect(page.locator('button:has-text("Search Members")')).toBeEnabled();
  });

  test('date of birth validation works', async ({ page }) => {
    await page.fill('#lastName', 'Smith');
    
    // Enter future date - should show error
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    await page.fill('#dateOfBirth', futureDate.toISOString().split('T')[0]);
    
    // Should show validation error
    await expect(page.locator('.error-message')).toContainText('Please enter a valid date of birth');
  });

  test('search results show member cards with complete information', async ({ page }) => {
    await page.fill('#lastName', 'Smith');
    await page.click('button:has-text("Search Members")');
    
    await expect(page.locator('.member-card')).toBeVisible({ timeout: 10000 });
    
    // Check member card contains essential information
    await expect(page.locator('.member-name')).toBeVisible();
    await expect(page.locator('.member-id')).toBeVisible();
    await expect(page.locator('.detail-label:has-text("Born:")')).toBeVisible();
    await expect(page.locator('.detail-label:has-text("Phone:")')).toBeVisible();
    await expect(page.locator('.detail-label:has-text("Email:")')).toBeVisible();
  });

  test('search results show count', async ({ page }) => {
    await page.fill('#lastName', 'Smith');
    await page.click('button:has-text("Search Members")');
    
    await expect(page.locator('.results-section')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.results-count')).toBeVisible();
    await expect(page.locator('.results-count')).toContainText('member(s) found');
  });

  test('can select member from results', async ({ page }) => {
    await page.fill('#lastName', 'Smith');
    await page.click('button:has-text("Search Members")');
    
    await expect(page.locator('.member-card')).toBeVisible({ timeout: 10000 });
    
    // Click on first member
    await page.click('.member-card:first-child');
    
    // Should show selected state
    await expect(page.locator('.member-card.selected')).toBeVisible();
    await expect(page.locator('.selected-badge')).toContainText('✓');
    await expect(page.locator('.select-hint')).toContainText('Selected for details view');
  });

  test('member details expand after selection', async ({ page }) => {
    await page.fill('#lastName', 'Smith');
    await page.click('button:has-text("Search Members")');
    await expect(page.locator('.member-card')).toBeVisible({ timeout: 10000 });
    await page.click('.member-card:first-child');
    
    // Should see expanded member details
    await expect(page.locator('.details-section')).toBeVisible();
    await expect(page.locator('h2:has-text("Member Details")')).toBeVisible();
    
    // Check all detail sections
    await expect(page.locator('h3:has-text("Personal Information")')).toBeVisible();
    await expect(page.locator('h3:has-text("Contact Information")')).toBeVisible();
    await expect(page.locator('h3:has-text("Address")')).toBeVisible();
  });

  test('member details show formatted information', async ({ page }) => {
    await page.fill('#lastName', 'Smith');
    await page.click('button:has-text("Search Members")');
    await expect(page.locator('.member-card')).toBeVisible({ timeout: 10000 });
    await page.click('.member-card:first-child');
    
    // Check formatted data elements
    await expect(page.locator('.value.monospace')).toBeVisible(); // Member ID
    await expect(page.locator('.value.email')).toBeVisible(); // Email
    await expect(page.locator('.value.address')).toBeVisible(); // Address
    
    // Check that address is properly formatted (multi-line)
    const addressValue = page.locator('.value.address');
    await expect(addressValue).toContainText('\n'); // Should contain line break
  });

  test('can perform new search after selection', async ({ page }) => {
    // First search
    await page.fill('#lastName', 'Smith');
    await page.click('button:has-text("Search Members")');
    await expect(page.locator('.member-card')).toBeVisible({ timeout: 10000 });
    await page.click('.member-card:first-child');
    
    // Clear and perform new search
    await page.click('button:has-text("Clear Form")');
    await expect(page.locator('.details-section')).not.toBeVisible();
    
    await page.fill('#lastName', 'Johnson');
    await page.click('button:has-text("Search Members")');
    
    // Should see new results
    await expect(page.locator('.results-section')).toBeVisible({ timeout: 10000 });
  });

  test('search error handling works', async ({ page }) => {
    // This would test error scenarios - implementation depends on your error handling
    // For example, if backend returns an error
    
    await page.fill('#lastName', 'NonExistentName12345');
    await page.click('button:has-text("Search Members")');
    
    // Should handle no results gracefully
    await expect(page.locator('.results-count')).toContainText('0 member(s) found');
  });

  test('keyboard navigation works for member selection', async ({ page }) => {
    await page.fill('#lastName', 'Smith');
    await page.click('button:has-text("Search Members")');
    await expect(page.locator('.member-card')).toBeVisible({ timeout: 10000 });
    
    // Focus and use keyboard navigation
    await page.locator('.member-card:first-child').focus();
    await page.keyboard.press('Enter');
    
    // Should select the member
    await expect(page.locator('.member-card.selected')).toBeVisible();
    await expect(page.locator('.details-section')).toBeVisible();
  });
});