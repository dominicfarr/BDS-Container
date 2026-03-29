import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/BDS-Container/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('create new workflow', async ({ page }) => {
  await page.getByPlaceholder('Workflow name').fill('Cameron - Takeoff');
  await page.getByRole('button', { name: 'New Workflow' }).click();
  await expect(page.getByRole('heading', { name: 'Cameron - Takeoff' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Row' })).toBeVisible();
});

test('add observation row with auto-numbered step', async ({ page }) => {
  await page.getByPlaceholder('Workflow name').fill('Test WF');
  await page.getByRole('button', { name: 'New Workflow' }).click();

  await page.getByRole('button', { name: 'Add Row' }).click();

  await expect(page.locator('tbody tr').first().locator('td').first()).toHaveText('1');
});

test('fill required fields and persist to localStorage', async ({ page }) => {
  await page.getByPlaceholder('Workflow name').fill('Test WF');
  await page.getByRole('button', { name: 'New Workflow' }).click();
  await page.getByRole('button', { name: 'Add Row' }).click();

  const row = page.locator('tbody tr').first();
  await row.getByRole('textbox').nth(0).fill('Review document');
  await row.getByRole('textbox').nth(1).fill('Client folder');
  await row.getByRole('textbox').nth(2).fill('Excel');
  await row.getByRole('textbox').nth(3).fill('Summary report');

  await page.reload();

  const reloadedRow = page.locator('tbody tr').first();
  await expect(reloadedRow.getByRole('textbox').nth(0)).toHaveValue('Review document');
  await expect(reloadedRow.getByRole('textbox').nth(1)).toHaveValue('Client folder');
});

test('notes field is optional — row saves without it', async ({ page }) => {
  await page.getByPlaceholder('Workflow name').fill('Test WF');
  await page.getByRole('button', { name: 'New Workflow' }).click();
  await page.getByRole('button', { name: 'Add Row' }).click();

  const row = page.locator('tbody tr').first();
  await row.getByRole('textbox').nth(0).fill('Review document');
  await row.getByRole('textbox').nth(1).fill('Client folder');
  await row.getByRole('textbox').nth(2).fill('Excel');
  await row.getByRole('textbox').nth(3).fill('Summary report');
  // Leave notes empty

  await page.reload();

  await expect(page.locator('tbody tr').first().getByRole('textbox').nth(0)).toHaveValue('Review document');
});

test('character count displays for notes field', async ({ page }) => {
  await page.getByPlaceholder('Workflow name').fill('Test WF');
  await page.getByRole('button', { name: 'New Workflow' }).click();
  await page.getByRole('button', { name: 'Add Row' }).click();

  await page.locator('tbody tr').first().locator('textarea').fill('Hello');

  await expect(page.getByText('5 / 500 chars')).toBeVisible();
});

test('delete row removes it from the table', async ({ page }) => {
  await page.getByPlaceholder('Workflow name').fill('Test WF');
  await page.getByRole('button', { name: 'New Workflow' }).click();
  await page.getByRole('button', { name: 'Add Row' }).click();
  await page.getByRole('button', { name: 'Add Row' }).click();

  await expect(page.locator('tbody tr')).toHaveCount(2);

  await page.getByRole('button', { name: 'Delete row' }).first().click();

  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody tr').first().locator('td').first()).toHaveText('1');
});

test('download CSV button triggers file download', async ({ page }) => {
  await page.getByPlaceholder('Workflow name').fill('Test WF');
  await page.getByRole('button', { name: 'New Workflow' }).click();
  await page.getByRole('button', { name: 'Add Row' }).click();

  const row = page.locator('tbody tr').first();
  await row.getByRole('textbox').nth(0).fill('Review');
  await row.getByRole('textbox').nth(1).fill('Doc');
  await row.getByRole('textbox').nth(2).fill('Excel');
  await row.getByRole('textbox').nth(3).fill('Report');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download CSV' }).click(),
  ]);

  expect(download.suggestedFilename()).toBe('Test WF.csv');
});

test('switch between workflows', async ({ page }) => {
  await page.getByPlaceholder('Workflow name').fill('WF Alpha');
  await page.getByRole('button', { name: 'New Workflow' }).click();
  await page.getByRole('button', { name: 'Add Row' }).click();

  await page.getByPlaceholder('Workflow name').fill('WF Beta');
  await page.getByRole('button', { name: 'New Workflow' }).click();

  await page.getByRole('combobox').selectOption('WF Alpha');

  await expect(page.getByRole('heading', { name: 'WF Alpha' })).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(1);
});
