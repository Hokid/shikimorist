import {IParser} from '../types';

export class OnlineAnimediaParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'online.animedia.tv' && /^\/anime\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const name = document.querySelector('.media__post__original-title');

        if (!name) {
            return null;
        }
        return name.innerHTML;
    }
}
