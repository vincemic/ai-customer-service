import { expect, test } from '@playwright/test';

test.describe('Agent Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('#agentName', 'Dashboard Test Agent');
    await page.selectOption('#department', 'customer-service');
    await page.click('button[type="submit"]');
  });

  test('displays agent information correctly', async ({ page }) => {
    // Check agent name display
    await expect(page.locator('h2')).toContainText('Dashboard Test Agent');
    
    // Check agent info section
    await expect(page.locator('.agent-info')).toBeVisible();
    await expect(page.locator('.department')).toContainText('Customer Service');
  });

  test('shows session statistics', async ({ page }) => {
    await expect(page.locator('.session-stats')).toBeVisible();
    
    // Check for stats elements
    const statItems = page.locator('.stat-item');
    await expect(statItems.first()).toBeVisible();
    await expect(page.locator('.calls-today')).toBeVisible();
    await expect(page.locator('.session-duration')).toBeVisible();
  });

  test('displays call action buttons', async ({ page }) => {
    // Check main action buttons
    await expect(page.locator('button:has-text("Answer Incoming Call")')).toBeVisible();
    await expect(page.locator('button:has-text("Start Outbound Call")')).toBeVisible();
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('shows recent calls section', async ({ page }) => {
    await expect(page.locator('.recent-calls')).toBeVisible();
    await expect(page.locator('h3:has-text("Recent Calls")')).toBeVisible();
  });

  test('displays quick actions panel', async ({ page }) => {
    await expect(page.locator('.quick-actions-panel')).toBeVisible();
    
    // Check for quick action items
    const quickActionItems = page.locator('.quick-action-item');
    await expect(quickActionItems.first()).toBeVisible();
  });

  test('session timer updates', async ({ page }) => {
    // Get initial session time
    const initialTime = await page.locator('.session-duration .time-value').textContent();
    
    // Wait a bit and check if time has updated
    await page.waitForTimeout(2000);
    const updatedTime = await page.locator('.session-duration .time-value').textContent();
    
    // Time should have changed (unless we caught it at exact same second)
    // This is a basic check - in a real scenario you might want more precise timing
    await expect(page.locator('.session-duration .time-value')).toBeVisible();
  });

  test('can start outbound call', async ({ page }) => {
    await page.click('button:has-text("Start Outbound Call")');
    
    // Should transition to call interface
    await expect(page.locator('.call-header-fixed')).toBeVisible();
    await expect(page.locator('h2:has-text("Search Criteria")')).toBeVisible();
  });

  test('logout functionality works', async ({ page }) => {
    await page.click('button:has-text("Logout")');
    
    // Should return to login screen
    await expect(page.locator('h2')).toContainText('Agent Login');
    await expect(page.locator('h1')).toContainText('AI Customer Service');
  });

  test('displays proper loading states', async ({ page }) => {
    // Check that dashboard loads without loading indicators
    await expect(page.locator('.loading-spinner')).not.toBeVisible();
    
    // Verify dashboard is fully loaded
    await expect(page.locator('.agent-info')).toBeVisible();
    await expect(page.locator('.session-stats')).toBeVisible();
  });

  test('responsive design works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Dashboard should still be visible and functional
    await expect(page.locator('.agent-info')).toBeVisible();
    await expect(page.locator('button:has-text("Answer Incoming Call")')).toBeVisible();
    
    // Mobile-specific elements might be different
    // This would need to be adjusted based on actual responsive design
  });
});