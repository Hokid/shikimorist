import {IParser} from '../types';

export class AnimeGoParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'anilibria.tv' && /^\/release\/.+/.test(path);
    }

    parse(document: Document): string | null {
		const nameArr = document.querySelector('#xreleaseInfo h1').innerText.split(/(?<=\S)\s\/\s(?=\S)|\n/g)
        const name = nameArr[0]
        const alternatives = nameArr[1]

        return (
            alternatives
                ? alternatives
                : name
                    ? name
                    : null
        );
    }
}
