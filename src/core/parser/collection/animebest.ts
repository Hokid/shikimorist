import {IParser} from '../types';

export class AnimebestParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'animebest.org' && /^\/anime\/.+/.test(path);
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
