import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string): Promise<string> {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });
    return await page.content();
}

describe('wikianime.tv', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('default', async function() {
        const url = 'https://wikianime.tv/anime/Sen_to_Chihiro_no_Kamikakushi';
        const content = await getContent(page, url);
        const dom = new JSDOM(content, {
            url
        });
        const name = getName(dom.window.document);
        expect(name).toBe('Sen to Chihiro no Kamikakushi');
    });

    test('player', async function() {
        const url = 'https://wikianime.tv/anime/Sword_Art_Online/1';
        const content = await getContent(page, url);
        const dom = new JSDOM(content, {
            url
        });
        const name = getName(dom.window.document);
        expect(name).toBe('Sword Art Online');
    });
})

