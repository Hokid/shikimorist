import {IParser} from '../types';

export class AnilibriaParser implements IParser {
    hosts = [
        {
            url: 'https://www.anilibria.tv',
            vpn: true
        }
    ];

    checkUrl(location: Location): boolean {
        const {host, pathname: path} = location;
        return host.endsWith('anilibria.tv') && /^\/release\/.+/.test(path);
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
