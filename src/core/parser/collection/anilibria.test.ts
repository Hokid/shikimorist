import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string): Promise<string> {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });
    return await page.content();
}

describe('anilibria.tv', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('default', async function() {
        const content = await getContent(page, 'https://www.anilibria.tv/release/edomae-elf.html');
        const dom = new JSDOM(content);
        const name = getName('www.anilibria.tv', '/release/edomae-elf.html', dom.window.document);
        expect(name).toBe('Edomae Elf');
    });
})

