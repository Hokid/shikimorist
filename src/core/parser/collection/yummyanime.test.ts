import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string): Promise<string> {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });
    return await page.content();
}

describe('yummyanime', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('.tv', async function() {
        const url = 'https://yummyanime.tv/105-klinok-rassekajuschij-demonov-f3.html';
        const content = await getContent(page, url);
        const dom = new JSDOM(content, {
            url
        });
        const name = getName(dom.window.document);
        expect(name).toBe('Kimetsu no Yaiba');
    }, 10000);

    test('.org', async function() {
        const url = 'https://yummyanime.org/208-klinok-rassekajuschij-demonov-kvartal-krasnyh-fonarej.html';
        const content = await getContent(page, url);
        const dom = new JSDOM(content, {
            url
        });
        const name = getName(dom.window.document);
        expect(name).toBe('Kimetsu no Yaiba: Yuukaku-hen');
    }, 10000);
})

