import { expect, test } from '@playwright/test';

test('home renders its primary content', async ({ page }) => {
	const response = await page.goto('/');
	expect(response?.ok()).toBe(true);
	await expect(page.locator('main')).toBeVisible();
	await expect(page.locator('h1')).toBeVisible();
});

test('a visitor can open a blog post', async ({ page }) => {
	await page.goto('/blog/');
	const firstPost = page.locator('.blog-list-link').first();
	await expect(firstPost).toBeVisible();
	await firstPost.click();
	await expect(page.locator('article[data-pagefind-body]')).toBeVisible();
	await expect(page.locator('article[data-pagefind-body]')).not.toBeEmpty();
	await expect(page.locator('.related-posts')).toHaveCount(0);
});

test('search reads article content and categories have static pages', async ({ page }) => {
	await page.goto('/blog/');
	await page.locator('.blog-search input').fill('mot vai am dieu');
	await expect(page.locator('.blog-list-link')).toHaveCount(1);
	await expect(page.locator('.blog-list-link')).toContainText('Một vài âm điệu từ tôi');

	await page.goto('/blog/');
	const category = page.locator('.blog-category-link[href*="/blog/category/"]').first();
	await category.click();
	await expect(page).toHaveURL(/\/blog\/category\/[^/]+\/$/);
	await expect(page.locator('.blog-category-link.is-active')).toBeVisible();
	await expect(page.locator('h1')).toHaveClass(/sr-only/);
});

test('an unknown route returns the custom 404 page', async ({ page }) => {
	const response = await page.goto('/__tblog_smoke_missing__/');
	expect(response?.status()).toBe(404);
	await expect(page.getByText('404', { exact: true })).toBeVisible();
	await expect(page.locator('h1')).toBeVisible();
});
