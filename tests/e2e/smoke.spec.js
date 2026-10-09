import { test, expect } from '@playwright/test';
test('smoke: build abre e partida começa', async ({page}) => {
  const errors=[];page.on('pageerror', error=>errors.push(error.message));await page.goto('./');
  await expect(page.getByRole('heading',{name:'Spell & Solve',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Jogar agora'}).click();await expect(page.locator('#answer')).toBeEnabled();
  if (process.env.EXPECTED_SHA) {
    const response = await page.request.get(new URL('version.json',page.url()).href);
    expect(response.ok()).toBe(true);expect((await response.json()).commit).toBe(process.env.EXPECTED_SHA);
  }
  await expect(page.locator('#challenges')).toContainText(/\d+ [−+×÷-] \d+/);expect(errors).toEqual([]);
});
