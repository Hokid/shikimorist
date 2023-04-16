import {IParser} from '../types';

export class WikianimeParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host.endsWith('wikianime.tv') && /^\/anime\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const namesStr = document.querySelector('meta[property="og:title"]');

        if (namesStr) {
            const content = namesStr.getAttribute('content');
            if (content) {
                const names = content.split('|');
                const latinName = names[1];
                if (latinName) {
                    return latinName.trim();
                }
            }
        }

        return null;
    }
}
