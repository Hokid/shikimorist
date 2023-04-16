import {IParser} from '../types';

export class AkariAnimeParser implements IParser {
    hosts = [
        {
            url: 'https://akari-anime.com'
        }
    ];

    checkUrl(host: string, path: string): boolean {
        return host === 'akari-anime.com' && /^\/movie\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const namesStr = document.querySelector('meta[property="og:title"]');

        if (namesStr) {
            const content = namesStr.getAttribute('content');
            if (content) {
                const names = content.split('/');
                const latinName = names[1];
                if (latinName) {
                    return latinName.trim();
                }
            }
        }


        return null;
    }
}
