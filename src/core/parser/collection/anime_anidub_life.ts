import {IParser} from '../types';

const EndRE = /[^\s]+ (из|по) [^\s]+(.+)?/;

export class AnimeAnidubLifeParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'anidub.life' && /^\/anime(_movie|_ova|_ongoing|_tv|_ona)?|full\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const namesStr = document.querySelector('meta[property="og:title"]');

        if (namesStr) {
            const content = namesStr.getAttribute('content');
            if (content) {
                const names = content.split('/');
                let latinName = names[1];
                if (latinName) {
                    latinName = latinName.replace(EndRE, '');
                    return latinName.trim();
                }
            }
        }

        return null;
    }
}
