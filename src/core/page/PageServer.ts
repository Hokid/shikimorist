import {PageLookupResult} from './types';
import {Store} from '../store';
import {getName} from '../parser';
import {Consumer} from '../messager/consumer';
import {ChromeRuntimeBus} from '../messager/bus-library/chrome-runtime/chrome-runtime-bus';
import {AnimeInfoMessage, SetAnimeMessage} from './messages';

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
    private store = new Store();
    private consumer = new Consumer('page', new ChromeRuntimeBus());

    constructor() {
        this.consumer.on<SetAnimeMessage>('set-anime', (data, resolve, reject) => {
            if (!data) {
                return;
            }

            this.setAnimeToCache(data)
                .then(resolve, reject);
            return true;
        });

        this.consumer.on<AnimeInfoMessage>('anime-info', (data, resolve, reject) => {
            console.log('aaa');
            this.getAnimeInfo()
                .then(resolve, reject);
            return true;
        });
    }

    async setAnimeToCache(anime: { id: number } | undefined): Promise<void> {
        await this.store.setAnimeForURL(this.getLocation(), anime);
    }

    async getAnimeFromCache(): Promise<{ id: number } | void> {
        return this.store.getAnimeForURL(this.getLocation());
    }

    getLocation(): string {
        return window.location.href.replace(/^https?:\/\//, '');
    }

    async getAnimeInfo(): Promise<PageLookupResult | null> {
        const cached = await this.getAnimeFromCache();

        if (cached) {
            return {
                type: 'anime',
                value: cached
            };
        }

        await ensurePageLoaded;

        const name = getName(
            window.location.host,
            window.location.pathname,
            window.document
        );

        if (name) {
            return {
                type: 'name',
                value: name
            };
        } else {
            return null;
        }
    }
}
