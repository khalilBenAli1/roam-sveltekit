import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { demoPlans } from '../src/lib/fixtures';
const route = 'trips/kyoto/';
const card = (page: Page, name: string) =>
  page.getByRole('article', { name, exact: true });
async function add(page: Page, name: string, time = '10:30') {
  await page.getByRole('button', { name: 'Add activity', exact: true }).click();
  await page.getByLabel('Activity name').fill(name);
  await page.getByLabel('Start time').fill(time);
  await page.getByLabel('Estimate (EUR)').fill('12.34');
  await page.getByRole('button', { name: 'Add to my day' }).click();
}
test('edit, reorder by mouse and keyboard, move, conflict, undo and reload', async ({
  page
}) => {
  await page.goto(route);
  await expect(
    page.getByRole('heading', { name: 'The old town, slowly' })
  ).toBeVisible();
  await add(page, 'A test tea stop');
  await expect(card(page, 'A test tea stop')).toBeVisible();
  await expect(
    card(page, 'A test tea stop').getByText('Time overlaps another activity.', {
      exact: false
    })
  ).toBeVisible();
  await expect(
    page.getByRole('complementary', { name: 'Plan summary' })
  ).toContainText('€76.34');
  await page
    .getByRole('button', { name: 'Move A test tea stop earlier', exact: true })
    .click();
  await expect(page.locator('.timeline article').nth(3)).toHaveAttribute(
    'aria-label',
    'A test tea stop'
  );
  await page
    .getByRole('button', { name: 'Move A test tea stop earlier', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.timeline article').nth(2)).toHaveAttribute(
    'aria-label',
    'A test tea stop'
  );
  await card(page, 'A test tea stop')
    .getByRole('button', { name: 'Edit', exact: true })
    .click();
  await page.getByLabel('Activity name').fill('Tea and a tiny cake');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await card(page, 'Tea and a tiny cake')
    .getByLabel('Move Tea and a tiny cake to another day')
    .selectOption('kyoto-3');
  await expect(card(page, 'Tea and a tiny cake')).toHaveCount(0);
  await page
    .getByRole('navigation', { name: 'Trip days' })
    .getByRole('button', { name: /Day 3/ })
    .click();
  await expect(card(page, 'Tea and a tiny cake')).toBeVisible();
  await expect(
    page.getByRole('complementary', { name: 'Plan summary' })
  ).toContainText('€12.34');
  await page
    .getByRole('button', { name: 'Remove Tea and a tiny cake', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Leave room for a little wonder.' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(card(page, 'Tea and a tiny cake')).toBeVisible();
  await page.reload();
  await page
    .getByRole('navigation', { name: 'Trip days' })
    .getByRole('button', { name: /Day 3/ })
    .click();
  await expect(card(page, 'Tea and a tiny cake')).toBeVisible();
});
test('filters, saved places, empty day, validation and keyboard dialog focus', async ({
  page
}) => {
  await page.goto(route);
  await page.getByRole('button', { name: 'Travel', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'No travel plans yet.' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Show all activities' }).click();
  await expect(page.locator('.timeline article')).toHaveCount(4);
  await page
    .getByRole('navigation', { name: 'Trip days' })
    .getByRole('button', { name: /Day 3/ })
    .click();
  await page.getByRole('button', { name: 'Explore saved places' }).click();
  await page.getByRole('button', { name: 'Add to day 3' }).first().click();
  await expect(card(page, 'The philosopher’s path')).toBeVisible();
  const trigger = page.getByRole('button', {
    name: 'Add activity',
    exact: true
  });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByLabel('Activity name').fill('Late walk');
  await page.getByLabel('Start time').fill('23:30');
  await page.getByLabel('Duration (minutes)').fill('60');
  await page.getByRole('button', { name: 'Add to my day' }).click();
  await expect(page.getByRole('alert')).toContainText('after midnight');
  await page.keyboard.press('Escape');
});
test('exports and imports validated plans, rejects malformed and oversized files, resets with undo', async ({
  page
}) => {
  await page.goto(route);
  await add(page, 'Exportable tea');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export plans' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('roam-plans.json');
  const path = await download.path();
  expect(path).toBeTruthy();
  await page.getByRole('button', { name: 'Reset demo plans' }).click();
  await page
    .getByRole('button', { name: 'Reset all plans', exact: true })
    .click();
  await expect(card(page, 'Exportable tea')).toHaveCount(0);
  if (!path) throw Error('No exported file');
  await page.getByLabel('Import Roam plans').setInputFiles(path);
  await expect(card(page, 'Exportable tea')).toBeVisible();
  for (const payload of [
    { name: 'broken.json', buffer: Buffer.from('{oops') },
    { name: 'too-large.json', buffer: Buffer.alloc(300001) },
    { name: 'future.json', buffer: Buffer.from('{"version":9}') }
  ]) {
    await page
      .getByLabel('Import Roam plans')
      .setInputFiles({ ...payload, mimeType: 'application/json' });
    await expect(page.getByRole('alert')).toContainText(
      'Your current plans have not changed'
    );
    await expect(card(page, 'Exportable tea')).toBeVisible();
  }
  await page.getByRole('button', { name: 'Dismiss import error' }).click();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(card(page, 'Exportable tea')).toHaveCount(0);
});
test('recovers unreadable storage without overwriting it, then explicitly replaces it', async ({
  page
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('roam.plans.v1', '{broken')
  );
  await page.goto(route);
  await expect(page.getByRole('alert')).toContainText('left untouched');
  await add(page, 'Temporary stop');
  expect(await page.evaluate(() => localStorage.getItem('roam.plans.v1'))).toBe(
    '{broken'
  );
  await page.getByRole('button', { name: 'Replace unreadable data' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('roam.plans.v1')!).version
    )
  ).toBe(1);
});
test('blocked storage keeps planner functional and explains export fallback', async ({
  page
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      }
    })
  );
  await page.goto(route);
  await expect(page.getByRole('alert')).toContainText('storage is unavailable');
  await add(page, 'Memory-only plan');
  await expect(card(page, 'Memory-only plan')).toBeVisible();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(card(page, 'Memory-only plan')).toHaveCount(0);
});
test('valid imported data keeps direct routes and escapes markup', async ({
  page
}) => {
  await page.goto('');
  const plans = demoPlans();
  plans.trips[1].days[0].activities[0].title = '<img src=x onerror=alert(1)>';
  await page.getByLabel('Import Roam plans').setInputFiles({
    name: 'valid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(plans))
  });
  await page.goto('trips/lisbon/');
  await expect(card(page, '<img src=x onerror=alert(1)>')).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Lisbon, in no hurry' })
  ).toBeVisible();
  await page.goto('trips/dolomites/');
  await expect(
    page.getByRole('heading', { name: 'A breath of alpine air' })
  ).toBeVisible();
});
for (const width of [390, 768, 1440])
  test(`reflow, reduced motion and accessibility at ${width}px`, async ({
    page
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    await expect(
      page.getByRole('heading', { name: /Make room for/ })
    ).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth
      )
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations
    ).toEqual([]);
    await page.goto(route);
    const reset = page.getByRole('button', {
      name: 'Reset demo plans',
      exact: true
    });
    await expect(reset).toBeVisible();
    await reset.click();
    await page
      .getByRole('button', { name: 'Keep my plans', exact: true })
      .click();
    await expect(reset).toBeFocused();
    await expect(
      page.getByRole('button', { name: 'Add activity', exact: true })
    ).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth
      )
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations
    ).toEqual([]);
  });

test('cached planner reloads offline with saved edits', async ({
  page,
  context
}) => {
  await page.goto(route);
  await add(page, 'An offline little plan');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          () => resolve(),
          { once: true }
        )
      );
  });
  await context.setOffline(true);
  await page.reload();
  await expect(card(page, 'An offline little plan')).toBeVisible();
  await page
    .getByRole('button', { name: 'Remove An offline little plan', exact: true })
    .click();
  await expect(card(page, 'An offline little plan')).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(card(page, 'An offline little plan')).toBeVisible();
});

test('large text reflows and direct unknown routes have a useful return link', async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  await page.addStyleTag({ content: 'html {font-size:200%} body {zoom:1.25}' });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth
    )
  ).toBe(true);
  await page.getByRole('button', { name: 'Add activity', exact: true }).click();
  await page
    .getByLabel('Activity name')
    .fill(
      'A long and lovely name for a morning wander through a neighborhood we have never visited before'
    );
  await page.getByRole('button', { name: 'Add to my day' }).click();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth
    )
  ).toBe(true);
  const response = await page.goto('a-path-that-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('link', { name: 'Back to my trips →' })
  ).toBeVisible();
});
