import {IParser} from '../types';

const DOMAIN_RE = /^(www|hd)\.kinopoisk\.ru$/;
const CLEAR_RE = [
    /Смотреть фильм ([^,]+), \d{4}/,
    /(.+?) — смотреть онлайн в хорошем качестве — Кинопоиск/
];

export class KinopoiskParser implements IParser {
    hosts = [
        {
            url: 'https://hd.kinopoisk.ru/',
        },
        {
            url: 'https://www.kinopoisk.ru/',
        }
    ];

    checkUrl(location: Location): boolean {
        const {host, pathname, search} = location;
        const match = host.match(DOMAIN_RE);
        if (match) {
            const [, sub] = match;
            if (sub === 'www') {
                if (pathname.startsWith('/film/') || pathname.startsWith('/series/')) {
                    return true;
                }
            } else if (sub === 'hd') {
                if (pathname.startsWith('/film/')) {
                    return true;
                }
                const searchParams = new URLSearchParams(search);
                if (searchParams.has('watch') || searchParams.has('rt')) {
                    return true;
                }
            }
        }
        return false;
    }

    parse(document: Document): string | null {
        const {host, pathname, search} = document.location;
        const [, sub] = host.match(DOMAIN_RE)!;
        if (sub === 'www') {
            const el = document.querySelector('[class^=styles_originalTitle]');
            if (el && el.textContent) {
                return el.textContent.trim();
            }
        } else if (sub === 'hd') {
            const searchParams = new URLSearchParams(search);
            if (searchParams.has('watch') && searchParams.has('continueWatching')) {
                const el = document.title;
                if (el) {
                    return this.clear(el).trim();
                }
            } else if (searchParams.has('rt') || searchParams.has('watch') || pathname.startsWith('/film/')) {
                const pre = searchParams.has('rt')
                    ? '[class^=CrispySlideDown_wrapper] '
                    : '';
                const text = document.querySelector(pre + '[class^=OverviewTitle_text]');
                if (text && text.textContent) {
                    return text.textContent.trim();
                }
                const image = document.querySelector(pre + '[class^=OverviewTitle_image]');
                if (image && image.getAttribute('alt')) {
                    return this.clear(image.getAttribute('alt')!).trim();
                }
            }
        }
        return null;
    }

    private clear(text: string): string {
        for (const re of CLEAR_RE) {
            const result = text.replace(re, '$1');
            if (result) {
                return result;
            }
        }
        return text;
    }
}
