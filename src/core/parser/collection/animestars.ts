import {IParser} from '../types';

export class AnimestarsParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'animestars.org' && /^\/aniserials\/video\/[^/]+\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const rusName = document.querySelector('.btoom-title > h1');
        const latName = document.querySelector('.short-t-or > h2');

        return (
            latName
                ? latName.innerHTML
                : rusName
                    ? rusName.innerHTML.replace(/ - .+?$/, '')
                    : null
        );
    }
}
