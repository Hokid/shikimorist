import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from './index';

async function getContent(page: Page, url: string): Promise<string> {
    await page.goto(url);
    return await page.content();
}

describe('parsers', function() {
    let page: Page, browser: Browser;

    beforeAll(async function() {
        jest.setTimeout(30000);
        browser = await p.launch();
        page = await browser.newPage();
    });

    afterAll(async function () {
        await browser.close();
    });

    test('https://animego.org', async function() {
        const content = await getContent(page, 'https://animego.org/anime/gospozha-kaguya-v-lyubvi-kak-na-voyne-2-1527');
        const dom = new JSDOM(content);
        const name = getName('animego.org', '/anime/gospozha-kaguya-v-lyubvi-kak-na-voyne-2-1527', dom.window.document);
        expect(name).toBe('Kaguya-sama wa Kokurasetai?: Tensai-tachi no Renai Zunousen');
    });

    test('https://animebest.org', async function() {
        const content = await getContent(page, 'https://animebest.org/anime-ab/4514-shin-sakura-taisen-the-animation-ab1.html');
        const dom = new JSDOM(content);
        const name = getName('animebest.org', '/anime-ab/4514-shin-sakura-taisen-the-animation-ab1.html', dom.window.document);
        expect(name).toBe('Shin Sakura Taisen the Animation');
    });

    test('https://yummyanime.club', async function() {
        const content = await getContent(page, 'https://yummyanime.club/catalog/item/akvarion-tv1');
        const dom = new JSDOM(content);
        const name = getName('yummyanime.club', '/catalog/item/akvarion-tv1', dom.window.document);
        expect(name).toBe('Aquarion');
    });

    test('https://animestars.org', async function() {
        const content = await getContent(page, 'https://animestars.org/aniserials/video/historical/721-nebo-v-cvetu.html');
        const dom = new JSDOM(content);
        const name = getName('animestars.org', '/aniserials/video/historical/721-nebo-v-cvetu.html', dom.window.document);
        expect(name).toBe('Appare Ranman!');
    });

    test('https://online.animedia.tv', async function() {
        const content = await getContent(page, 'https://online.animedia.tv/anime/lovushka-lzhi');
        const dom = new JSDOM(content);
        const name = getName('online.animedia.tv', '/anime/lovushka-lzhi', dom.window.document);
        expect(name).toBe('Netsuzou TRap');
    });

    test('https://animevost.org', async function() {
        const content = await getContent(page, 'https://animevost.org/tip/tv/2449-shi-huang-zhi-shen.html');
        const dom = new JSDOM(content);
        const name = getName('animevost.org', '/tip/tv/2449-shi-huang-zhi-shen.html', dom.window.document);
        expect(name).toBe('Shi Huang Zhi Shen');
    });
})

