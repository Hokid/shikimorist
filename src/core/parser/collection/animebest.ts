import {IParser} from '../types';

export class AnimebestParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        // *.animebesst.org
        return /[a-zA-Z0-9]+\.animebesst\.org$/.test(host) && /^\/anime(-ab)?\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const namesStr = document.querySelector('meta[property="og:title"]');

        if (!namesStr) {
            return null;
        }

        const [rus, lat] = (namesStr.getAttribute('content') as string).split(' / ');

        return (
            lat
                ? lat
                : rus
                    ? rus
                    : null
        );
    }
}
