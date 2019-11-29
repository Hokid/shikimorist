import {RequestPageData, SetAnime} from '../messages';
import {PageLookupResult} from './types';
import {IAnime} from '../api/animes';
import {ensureInstalled} from './serverInstaller';


export class PageClient {
    async request(): Promise<PageLookupResult | null> {
        await ensureInstalled();

        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id as number, {
                        event: 'request-page-data'
                    } as RequestPageData, resolve);
                } else {
                    resolve(null);
                }
            });
        });
    }

    setAnime(anime: IAnime | undefined): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id as number, {
                        event: 'set-anime',
                        value: anime
                    } as SetAnime, () => resolve());
                } else {
                    resolve();
                }
            });
        });
    }
}
