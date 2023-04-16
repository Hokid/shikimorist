import p, {Browser, Page} from 'puppeteer';
import {JSDOM} from 'jsdom';
import {getName} from '../index';

async function getContent(page: Page, url: string): Promise<string> {
  await page.goto(url, {
    waitUntil: 'domcontentloaded'
  });
  return await page.content();
}

describe('anidub.life', function() {
  let page: Page, browser: Browser;

  beforeAll(async function() {
    jest.setTimeout(30000);
    browser = await p.launch();
    page = await browser.newPage();
  });

  afterAll(async function () {
    await browser.close();
  });

  test('anime_movie', async function() {
    const content = await getContent(page, 'https://anidub.life/anime_movie/11143-boku.html');
    const dom = new JSDOM(content);
    const name = getName('anidub.life', '/anime_movie/11143-boku.html', dom.window.document);
    expect(name).toBe('Boku no Hero Academia the Movie: Heroes:Rising');
  });

  test('full', async function() {
    const content = await getContent(page, 'https://anidub.life/full/11153-tonikaku.html');
    const dom = new JSDOM(content);
    const name = getName('anidub.life', '/full/11153-tonikaku.html', dom.window.document);
    expect(name).toBe('Tonikaku Kawaii');
  });

  test('anime_ova', async function() {
    const content = await getContent(page, 'https://anidub.life/anime_ova/11522-teken.html');
    const dom = new JSDOM(content);
    const name = getName('anidub.life', '/anime_ova/11522-teken.html', dom.window.document);
    expect(name).toBe('Tekken: Bloodline');
  });

  test('anime_ona', async function() {
    const content = await getContent(page, 'https://anidub.life/anime_ona/10983-levius-levius-01-iz-12.html');
    const dom = new JSDOM(content);
    const name = getName('anidub.life', '/anime_ona/10983-levius-levius-01-iz-12.html', dom.window.document);
    expect(name).toBe('Levius');
  });

  test('anime_ongoing', async function() {
    const content = await getContent(page, 'https://anidub.life/anime_ongoing/11643-adskij-raj-jigokuraku-01-iz-13.html');
    const dom = new JSDOM(content);
    const name = getName('anidub.life', '/anime_ongoing/11643-adskij-raj-jigokuraku-01-iz-13.html', dom.window.document);
    expect(name).toBe('Jigokuraku');
  });

  test('anime_tv', async function() {
    const content = await getContent(page, 'https://anidub.life/anime_tv/11100-idolish7-vtoroy-takt-idolish7-second-beat-04-iz-12.html');
    const dom = new JSDOM(content);
    const name = getName('anidub.life', '/anime_tv/11100-idolish7-vtoroy-takt-idolish7-second-beat-04-iz-12.html', dom.window.document);
    expect(name).toBe('IDOLiSH7: Second Beat!');
  });
})

