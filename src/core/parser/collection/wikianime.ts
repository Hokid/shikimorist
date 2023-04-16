import {IParser} from '../types';

export class WikianimeParser implements IParser {
    hosts = [
        {
            url: 'https://wikianime.tv',
        }
    ];

    checkUrl(host: string, path: string): boolean {
        return host.endsWith('wikianime.tv') && /^\/anime\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const ogTitle = document.querySelector('meta[property="og:title"]');

        if (ogTitle) {
            const content = ogTitle.getAttribute('content');
            if (content) {
                const names = content.split('|');
                const latinName = names[1];
                if (latinName) {
                    return latinName.trim();
                }
            }
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');

        if (ogDescription) {
            const content = ogDescription.getAttribute('content');
            if (content) {
                const name = content.match(/\(([^,]+),[^)]+\)/);
                if (name) {
                    return name[1].trim();
                }
            }
        }

        return null;
    }
}
