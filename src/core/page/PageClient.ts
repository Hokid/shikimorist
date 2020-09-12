import {PageLookupResult} from './types';
import {IAnime} from '../api/animes';
import {ensureInstalled} from './serverInstaller';
import {Producer} from '../messager/producer';
import {ChromeRuntimeBus} from '../messager/bus-library/chrome-runtime/chrome-runtime-bus';
import {AnimeInfoMessage, SetAnimeMessage} from './messages';


export class PageClient {
    private producer: Producer = new Producer('page', new ChromeRuntimeBus({
        sendMethod: 'currentTab'
    }));

    async request(): Promise<PageLookupResult | null> {
        await ensureInstalled();
        return this.producer.send(new AnimeInfoMessage(), true);
    }

    setAnime(anime: IAnime | void): Promise<void> {
        return this.producer.send(new SetAnimeMessage(anime ? {id: anime.id} : void 0), true);
    }
}
