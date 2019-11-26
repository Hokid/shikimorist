import {PingPage, SetAnime} from '../messages';
import {PageLookupResult} from './types';
import {IAnime} from '../api/animes';


export class PageClient {
    request(): Promise<PageLookupResult | null> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id as number, {
                        event: 'pingPage'
                    } as PingPage, resolve);
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
