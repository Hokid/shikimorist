import {IParser} from '../types';

export class RezkaAg implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'rezka.ag' && /\/animation\/\w+\/\d+/.test(path);
    }

    parse(document: Document): string | null {
        const titleName = document.querySelector(".b-post__origtitle")
		const tmp = titleName.textContent.split(' / ')
		return tmp[0]?tmp[0]:null
    }
}
