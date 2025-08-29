import { expect, test } from '@playwright/test';

test.describe('Call Notes Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login and start a call
    await page.goto('/');
    await page.fill('#agentName', 'Test Agent');
    await page.selectOption('#department', 'customer-service');
    await page.click('button[type="submit"]');
    await page.click('button:has-text("Answer Incoming Call")');
  });

  test('call notes footer appears during call', async ({ page }) => {
    // Should see call notes footer
    await expect(page.locator('.call-notes-footer')).toBeVisible();
  });

  test('can expand call notes footer', async ({ page }) => {
    // Click to expand notes
    await page.click('.call-notes-footer .expand-btn');
    
    // Should see expanded notes area
    await expect(page.locator('.call-notes-footer.expanded')).toBeVisible();
    await expect(page.locator('.notes-textarea')).toBeVisible();
  });

  test('can type in call notes', async ({ page }) => {
    // Expand notes
    await page.click('.call-notes-footer .expand-btn');
    
    // Type notes
    const testNote = 'Customer called about billing inquiry. Reviewed account details.';
    await page.fill('.notes-textarea', testNote);
    
    // Should see character count
    await expect(page.locator('.character-count')).toBeVisible();
    await expect(page.locator('.character-count')).toContainText(`${testNote.length}`);
  });

  test('call notes persist during member search', async ({ page }) => {
    // Expand and add notes
    await page.click('.call-notes-footer .expand-btn');
    const testNote = 'Initial call notes';
    await page.fill('.notes-textarea', testNote);
    
    // Search for member
    await page.fill('#lastName', 'Smith');
    await page.click('button:has-text("Search Members")');
    await expect(page.locator('.member-card')).toBeVisible({ timeout: 10000 });
    
    // Notes should still be there
    await expect(page.locator('.notes-textarea')).toHaveValue(testNote);
  });

  test('quick action buttons work', async ({ page }) => {
    // Expand notes
    await page.click('.call-notes-footer .expand-btn');
    
    // Should see quick action buttons
    await expect(page.locator('.quick-actions')).toBeVisible();
    await expect(page.locator('button:has-text("Billing")')).toBeVisible();
    await expect(page.locator('button:has-text("Claims")')).toBeVisible();
    await expect(page.locator('button:has-text("Benefits")')).toBeVisible();
    
    // Click a quick action
    await page.click('button:has-text("Billing")');
    
    // Should add template text
    await expect(page.locator('.notes-textarea')).toContainText('BILLING INQUIRY:');
  });

  test('can save call notes', async ({ page }) => {
    // Expand and add notes
    await page.click('.call-notes-footer .expand-btn');
    await page.fill('.notes-textarea', 'Test call notes for saving');
    
    // Save notes
    await page.click('button:has-text("Save Notes")');
    
    // Should show save confirmation
    await expect(page.locator('.save-confirmation')).toBeVisible();
  });

  test('notes are cleared when call ends', async ({ page }) => {
    // Add notes
    await page.click('.call-notes-footer .expand-btn');
    await page.fill('.notes-textarea', 'Test notes to be cleared');
    
    // End call
    await page.click('.control-btn.end-call-btn');
    
    // Start new call
    await page.click('button:has-text("Answer Incoming Call")');
    
    // Notes should be empty
    await page.click('.call-notes-footer .expand-btn');
    await expect(page.locator('.notes-textarea')).toHaveValue('');
  });
});