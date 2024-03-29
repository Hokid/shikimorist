import {IParser} from '../types';

export class AnimevostParser implements IParser {
    hosts = [
        {
            url: 'https://animevost.org',
            vpn: true,
        },
        {
            url: 'https://v2.vost.pw',
        }
    ];

    checkUrl(location: Location): boolean {
        const {host, pathname: path} = location;
        return (host === 'v2.vost.pw' || host === 'animevost.org') && /^\/tip\/tv\/.+/.test(path);
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
