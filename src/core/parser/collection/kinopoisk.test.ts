import p, { Browser, LoadEvent, Page } from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string, waitUntil: LoadEvent = 'domcontentloaded'): Promise<string> {
    await page.goto(url, {
        waitUntil,
    });
    return await page.content();
}

describe('kinopoisk.ru', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('profile(film)', async function() {
        const url = 'https://www.kinopoisk.ru/film/1846/';
        const content = await getContent(page, url);
        const dom = new JSDOM(content, {
            url
        });
        const name = getName(dom.window.document);
        expect(name).toBe('Tenkuu no Shiro Laputa');
    });

    test('profile(series)', async function() {
        const url = 'https://www.kinopoisk.ru/series/843221/';
        const content = await getContent(page, url);
        const dom = new JSDOM(content, {
            url
        });
        const name = getName(dom.window.document);
        expect(name).toBe('Kiseijuu: Sei no Kakuritsu');
    });

    test('hd(film)', async function() {
        const url = 'https://hd.kinopoisk.ru/film/428a14295b9d9e159e3dc26572dbc7a2';
        const content = await getContent(page, url, 'networkidle0');
        const dom = new JSDOM(content, {
            url
        });
        const name = getName(dom.window.document);
        expect(name).toBe('Смотреть Сад изящных слов');
    });

    // https://hd.kinopoisk.ru/?continueWatching=1&rt=ID&watch= (watch from the continue list)
    // https://hd.kinopoisk.ru/selection/item_to_item__843221__0?rt=ID&selectionWindowId=home (details from the suggested list)
    // https://hd.kinopoisk.ru/selection/item_to_item__843221__0?rt=ID&selectionWindowId=home&watch= (details from the suggested list)
})

