import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string): Promise<string> {
    await page.goto(url);
    return await page.content();
}

describe('online.animedia.tv', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('default', async function() {
        const content = await getContent(page, 'https://online.animedia.tv/anime/lovushka-lzhi');
        const dom = new JSDOM(content);
        const name = getName('online.animedia.tv', '/anime/lovushka-lzhi', dom.window.document);
        expect(name).toBe('Netsuzou TRap');
    });
})

