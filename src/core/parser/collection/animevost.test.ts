import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string): Promise<string> {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });
    return await page.content();
}

describe('animevost.org', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('animevost.org (VPN)', async function() {
        const content = await getContent(page, 'https://animevost.org/tip/tv/2449-shi-huang-zhi-shen.html');
        const dom = new JSDOM(content);
        const name = getName('animevost.org', '/tip/tv/2449-shi-huang-zhi-shen.html', dom.window.document);
        expect(name).toBe('Shi Huang Zhi Shen');
    });

    test('v2.vost.pw (mirror)', async function() {
        const content = await getContent(page, 'https://v2.vost.pw/tip/tv/2449-shi-huang-zhi-shen.html');
        const dom = new JSDOM(content);
        const name = getName('v2.vost.pw', '/tip/tv/2449-shi-huang-zhi-shen.html', dom.window.document);
        expect(name).toBe('Shi Huang Zhi Shen');
    });
})

