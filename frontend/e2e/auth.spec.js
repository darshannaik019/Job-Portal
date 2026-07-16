import { test, expect } from '@playwright/test';

test.describe('Authentication Flow E2E Tests', () => {
  const randomEmail = `e2e-user-${Math.floor(Math.random() * 1000000)}@example.com`;

  test('should register a job seeker, log out, and log back in', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/CareerPartner/);

    // 2. Navigate to Register Page
    await page.goto('/register');

    // Fill Register Form
    await page.fill('input[placeholder="John Doe"]', 'E2E Test Candidate');
    await page.fill('input[placeholder="name@example.com"]', randomEmail);
    await page.fill('input[placeholder="+1234567890"]', '1234567890');
    await page.fill('input[placeholder="Min 6 characters"]', 'password123');

    // Click submit
    await page.click('button[type="submit"]');

    // Verify redirected to user dashboard
    await page.waitForURL('/dashboard');
    await expect(page.locator('header')).toContainText('Dashboard Overview');

    // 3. Log out via Sidebar Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL('/');

    // 4. Log in again via Custom Sign In
    await page.goto('/login');
    await page.fill('input[placeholder="name@example.com"]', randomEmail);
    await page.fill('input[placeholder="Enter your password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verify redirected back to dashboard
    await page.waitForURL('/dashboard');
    await expect(page.locator('header')).toContainText('Dashboard Overview');
  });
});
