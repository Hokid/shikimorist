import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string): Promise<string> {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });
    return await page.content();
}

describe('online.anilibria.life', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('default', async function() {
        const content = await getContent(page, 'http://online.anilibria.life/online/vajolet-jevergarden-film-2020-1080-hd/7-1-0-882');
        const dom = new JSDOM(content);
        const name = getName('online.anilibria.life', '/online/vajolet-jevergarden-film-2020-1080-hd/7-1-0-882', dom.window.document);
        expect(name).toBe('Violet Evergarden Movie');
    });
})

