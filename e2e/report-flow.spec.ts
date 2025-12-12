
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Billboard Reporting Flow', () => {
    test('should allow a user to upload an image and see analysis', async ({ page }) => {
        // 1. Login
        await page.goto('/login');
        // Assuming standard shadcn/params auth form
        await page.fill('input[type="email"]', 'citizen@email.com');
        await page.fill('input[type="password"]', 'citizen123');
        // Look for a submit button. It might comprise of "Sign In" or similar
        await page.click('button[type="submit"]');

        // Wait for redirect to home or dashboard. 
        // If login is successful, we should be on home '/' or dashboard.
        await page.waitForURL('**/public-dashboard', { timeout: 10000 });

        // 3. Navigate to analysis dashboard
        await page.goto('/dashboard');

        // 4. Find the upload section
        await expect(page.getByText('Upload Billboard Image')).toBeVisible({ timeout: 10000 });

        // 5. Upload a file
        await page.setInputFiles('input[type="file"]:not([capture])', path.join(__dirname, '../public/placeholder.jpg'));

        // 6. Input Location (required now)
        await page.fill('input[placeholder*="Search for a location"]', 'Test Location, Bengaluru');
        // Select first option if autocomplete appears (simulated by just filling for now or clicking first option)
        // Given the component structure, filling might triggering state update.
        await page.keyboard.press('Enter');

        // 7. Click "Start AI Analysis"
        const startBtn = page.getByRole('button', { name: 'Start AI Analysis' });
        await expect(startBtn).toBeEnabled({ timeout: 5000 });
        await startBtn.click();

        // 8. Wait for results
        await expect(page.getByText('Compliance Analysis Results')).toBeVisible({ timeout: 20000 });

        // 9. Verify some result details
        await expect(page.getByText('Compliance Score')).toBeVisible();
    });
});
