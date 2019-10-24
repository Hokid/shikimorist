import {PingPage} from '../messages';
import {PageLookupResult} from './types';


export class AnimePageClient {
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
}
