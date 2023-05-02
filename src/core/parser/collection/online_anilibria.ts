import {IParser} from '../types';

export class OnlineAnilibriaParser implements IParser {
    hosts = [
        {
            url: 'https://anilibria.life',
        }
    ];

    checkUrl(location: Location): boolean {
        const {host, pathname: path} = location;
        return host === 'anilibria.life' && /^\/online\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const originalName = document.querySelector('#content ul.kino-lines li:first-child');

        if (originalName && originalName.childNodes[1]) {
            const mayBeTextNode = originalName.childNodes[1];
            if (mayBeTextNode.nodeType === document.TEXT_NODE) {
                return (<Text>mayBeTextNode).wholeText.trim();
            }
        }

        return null;
    }
}
