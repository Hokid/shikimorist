import {IParser} from '../types';

export class AnimeGoParser implements IParser {
    hosts = [
        {
            url: 'https://animego.org',
        },
        {
            url: 'https://animego.me',
        }
    ];

    checkUrl(location: Location): boolean {
        const {host, pathname: path} = location;
        const isSupportedHost = this.hosts.some(function(item) { return item.url.includes(host) });
        return isSupportedHost && /^\/anime\/.+/.test(path);
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
