import {Message} from '../messages';
import {PageLookupResult} from './types';


export class AnimePageServer {
    constructor(
        private onRequest: (response: (_: PageLookupResult | null) => any) => any
    ) {
        chrome.runtime.onMessage.addListener((message: Message, _, response) => {
            if (message.event === 'pingPage') {
                onRequest(response);
                return true;
            }
        });
    }
}
