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

    test('http://online.anilibria.life', async function() {
        const content = await getContent(page, 'http://online.anilibria.life/online/vajolet-jevergarden-film-2020-1080-hd/7-1-0-882');
        const dom = new JSDOM(content);
        const name = getName('online.anilibria.life', '/online/vajolet-jevergarden-film-2020-1080-hd/7-1-0-882', dom.window.document);
        expect(name).toBe('Violet Evergarden Movie');
    });

    test('https://akari-anime.com', async function() {
        const content = await getContent(page, 'https://akari-anime.com/movie/vosemdesyat-shest-86/');
        const dom = new JSDOM(content);
        const name = getName('akari-anime.com', '/movie/vosemdesyat-shest-86/', dom.window.document);
        expect(name).toBe('86');
    });

    test('https://anime.anidub.life', async function() {
        const content = await getContent(page, 'https://anime.anidub.life/anime_movie/11447-da-net-ili-navernoe-yes-ka-no-ka-hanbun-ka.html');
        const dom = new JSDOM(content);
        const name = getName('anime.anidub.life', '/anime_movie/11447-da-net-ili-navernoe-yes-ka-no-ka-hanbun-ka.html', dom.window.document);
        expect(name).toBe('Yes ka No ka Hanbun ka');
    });

    test('https://anime.anidub.life', async function() {
        const content = await getContent(page, 'https://anime.anidub.life/anime/full/8944-net-igry-net-zhizni-no-game-no-life-01-iz-12.html');
        const dom = new JSDOM(content);
        const name = getName('anime.anidub.life', '/anime/full/8944-net-igry-net-zhizni-no-game-no-life-01-iz-12.html', dom.window.document);
        expect(name).toBe('No Game No Life');
    });

    test('https://anime.anidub.life', async function() {
        const content = await getContent(page, 'https://anime.anidub.life/anime_ova/11446-okoldovannyj-nozomi-nozomi-witches-01-iz-03.html');
        const dom = new JSDOM(content);
        const name = getName('anime.anidub.life', '/anime_ova/11446-okoldovannyj-nozomi-nozomi-witches-01-iz-03.html', dom.window.document);
        expect(name).toBe('Nozomi Witches');
    });

    test('https://anime.anidub.life', async function() {
        const content = await getContent(page, 'https://anime.anidub.life/anime/anime_ongoing/11135-van-pis-one-piece-s-914-po-hhh.html');
        const dom = new JSDOM(content);
        const name = getName('anime.anidub.life', '/anime/anime_ongoing/11135-van-pis-one-piece-s-914-po-hhh.html', dom.window.document);
        expect(name).toBe('One Piece');
    });
    
    test('https://www.anilibria.tv/',async function(){
        const content = await getContent(page,'https://anilibria.tv/release/fate-stay-night-unlimited-blade-works-sudba-noch-skhvatki.html')
        const dom = new JSDOM(content);
        const name = getName('anilibria.tv','/release/fate-stay-night-unlimited-blade-works-sudba-noch-skhvatki.html',dowm.window.document);
        expect(name).toBe('Fate/stay night: Unlimited Blade Works')
		});
    
    test('https://www.anilibria.tv/',async function(){
        const content = await getContent(page,'https://anilibria.tv/release/spy-kyoushitsu.html')
        const dom = new JSDOM(content);
        const name = getName('anilibria.tv','/release/spy-kyoushitsu.html',dowm.window.document);
        expect(name).toBe('Spy Kyoushitsu')
		});
})

