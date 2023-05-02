import {IParser} from '../types';

export class AnimebestParser implements IParser {
    hosts = [
        {
            url: 'https://anime1.animebesst.org',
        }
    ];

    checkUrl(location: Location): boolean {
        const {host, pathname: path} = location;
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
