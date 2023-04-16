import {IParser} from '../types';

export class YummyanimeParser implements IParser {
    hosts = [
        {
            url: 'https://yummyanime.tv',
        },
        {
            url: 'https://yummyanime.org',
        }
    ];

    checkUrl(host: string, path: string): boolean {
        return /^yummyanime\.(tv|org)/.test(host) && /^\/[0-9]+-.+/.test(path);
    }

    parse(document: Document, host: string): string | null {
        let name: string | null = null;

        if (host.endsWith('.tv')) {
            const nameEl = document.querySelector('[itemprop="name"]');
            const alNameEl = document.querySelector('[itemprop="alternativeHeadline"]');
            if (alNameEl) {
                name = alNameEl.textContent;
            } else if (nameEl) {
                name = nameEl.textContent;
            }
        } else if (host.endsWith('.org')) {
            const nameEl = document.querySelector('.anime__title > h1');
            const alNameEl = document.querySelector('.pmovie__original-title');

            if (alNameEl) {
                name = alNameEl.textContent;
            } else if (nameEl) {
                name = nameEl.textContent;
            }
        }

        return name;
    }
}
