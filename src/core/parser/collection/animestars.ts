import {IParser} from '../types';

export class AnimestarsParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'animestars.org' && /^\/aniserials\/video\/[^/]+\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const rusName = document.querySelector('[itemprop="name"]');
        const alternative = document.querySelector('.pmovie__original-title');

        let latName: string | undefined;

        if (alternative) {
            const parts = alternative.innerHTML.split('/');
            latName = parts[0] || parts[1];
            latName = latName ? latName.trim() : undefined;
        }

        return (
            latName
                ? latName
                : rusName
                    ? rusName.innerHTML.replace(/ - .+?$/, '')
                    : null
        );
    }
}
