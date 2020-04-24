import {IParser} from '../types';

export class AnimevostParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'animevost.org' && /^\/tip\/tv\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const meta = document.querySelector('meta[property="og:title"]');

        if (!meta) {
            return null;
        }

        const content = (meta.getAttribute('content') as string)
            .replace(/\[[^\]]+\]$/, '');

        const [rus, lat] = content.split('/').map(_ => _.trim());

        return (
            lat
                ? lat
                : rus
                    ? rus
                    : null
        );
    }
}
