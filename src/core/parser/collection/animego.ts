import {IParser} from '../types';

export class AnimeGoParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'animego.org' && /^\/anime\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const name = document.querySelector('.anime-title h1');
        const alternatives = document.querySelectorAll('.anime-title [data-readmore="content"] > li');

        return (
            alternatives.length
                ? alternatives[0].innerHTML
                : name
                    ? name.innerHTML
                    : null
        );
    }
}
