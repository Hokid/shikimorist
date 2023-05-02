import {IParser} from '../types';

export class WikianimeParser implements IParser {
    hosts = [
        {
            url: 'https://wikianime.tv',
        }
    ];

    checkUrl(location: Location): boolean {
        const {host, pathname: path} = location;
        return host.endsWith('wikianime.tv') && /^\/anime\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const ogDescription = document.querySelector('meta[property="og:description"]');

        if (ogDescription) {
            const content = ogDescription.getAttribute('content');
            if (content) {
                const result = content.match(/\(([^,]+),([^)]+)\)/);
                if (result) {
                    const [,name1, name2] = result;
                    const latin = [name1, name2].find(_ => _ && /a-z/i.test(_));
                    if (latin) {
                        return this.clear(latin.trim());
                    }
                    return this.clear((name1 || name2).trim());
                }
            }
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');

        if (ogTitle) {
            const content = ogTitle.getAttribute('content');
            if (content) {
                const names = content.split('|');
                const latinName = names[1];
                if (latinName) {
                    return this.clear(latinName.trim());
                }
            }
        }

        return null;
    }

    private clear(value: string) {
        return value.replace(/season|сезон/gi, '')
    }
}
