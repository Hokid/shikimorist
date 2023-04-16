import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string): Promise<string> {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });
    return await page.content();
}

describe('animego.org', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('default', async function() {
        const content = await getContent(page, 'https://animego.org/anime/gospozha-kaguya-v-lyubvi-kak-na-voyne-2-1527');
        const dom = new JSDOM(content);
        const name = getName('animego.org', '/anime/gospozha-kaguya-v-lyubvi-kak-na-voyne-2-1527', dom.window.document);
        expect(name).toBe('Kaguya-sama wa Kokurasetai?: Tensai-tachi no Renai Zunousen');
    }, 10000);
})

