import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string): Promise<string> {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });
    return await page.content();
}

describe('animestars.org', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('default', async function() {
        const url = 'https://animestars.org/aniserials/video/historical/721-nebo-v-cvetu.html';
        const content = await getContent(page, url);
        const dom = new JSDOM(content, {
            url
        });
        const name = getName(dom.window.document);
        expect(name).toBe('Appare Ranman!');
    }, 10000);
})

