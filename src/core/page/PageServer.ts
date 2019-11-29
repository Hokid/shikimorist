import {Message} from '../messages';
import {PageLookupResult} from './types';
import {Store} from '../store';
import {IAnime} from '../api/animes';
import {getName} from '../parser';

const ensurePageLoaded = new Promise((resolve, reject) => {
    const listener = () => {
        resolve();
    };

    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.addEventListener('load', listener);
    }
});

export class PageServer {
    store = new Store();

    constructor() {
        chrome.runtime.onMessage.addListener((message: Message, _, response) => {
            if (message.event === 'request-page-data') {
                this.onRequest(response);
                return true;
            } else if (message.event === 'set-anime') {
                this.setAnime(message.value)
                    .then(response, response);
                return true;
            }
        });
    }

    async setAnime(anime: IAnime | undefined): Promise<void> {
        await this.store.setAnimeForURL(this.getLocation(), anime);
    }

    async getAnime(): Promise<IAnime | void> {
        return this.store.getAnimeForURL(this.getLocation());
    }

    getLocation(): string {
        return window.location.href.replace(/^https?:\/\//, '');
    }

    async onRequest(response: (_: PageLookupResult | null) => any)  {
        const cached = await this.getAnime();

        if (cached) {
            response({
                type: 'anime',
                value: cached
            });
            return;
        }

        await ensurePageLoaded;

        const name = getName(
            window.location.host,
            window.location.pathname,
            window.document
        );

        if (name) {
            response({
                type: 'name',
                value: name
            });
        } else {
            response(null)
        }
    }
}
