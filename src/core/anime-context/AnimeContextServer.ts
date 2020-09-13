import {AnimeDescriptionRequestResult} from './anime-description';
import {Store} from '../store';
import {getName} from '../parser';
import {AnimeDescriptionRequestMessage, SetAnimeDescriptionRequestMessage} from './chanel/messages';
import {ChanelFactory} from '../messager/ChanelFactory';
import {ANIME_DESCIPTION_CONTEXT_CHANEL} from './chanel/chanel';
import {Server} from '../remote-server/Server';

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

export class AnimeContextServer extends Server {
    private store = new Store();

    constructor(chanelFactory: ChanelFactory) {
        super(chanelFactory.create(ANIME_DESCIPTION_CONTEXT_CHANEL));
    }

    protected async onInitialization(): Promise<void> {
        this.onCommand<SetAnimeDescriptionRequestMessage>('set-anime', (data, resolve, reject) => {
            if (!data) {
                return;
            }

            this.setAnimeDescriptionToStorage(data)
                .then(resolve, reject);

            return true;
        });

        this.onCommand<AnimeDescriptionRequestMessage>('anime-info', (data, resolve, reject) => {
            this.getAnimeDescription()
                .then(resolve, reject);

            return true;
        });
    }

    private async setAnimeDescriptionToStorage(anime: { id: number } | undefined): Promise<void> {
        await this.store.setAnimeForURL(this.getCurrentURL(), anime);
    }

    private async getAnimeDescription(): Promise<AnimeDescriptionRequestResult> {
        const storageRecord = await this.getAnimeDescriptionFromStorage();

        if (storageRecord) {
            return {
                type: 'full',
                value: storageRecord
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
        }

        return null;
    }

    private async getAnimeDescriptionFromStorage(): Promise<{ id: number } | void> {
        return this.store.getAnimeForURL(this.getCurrentURL());
    }

    private getCurrentURL(): string {
        return window.location.href.replace(/^https?:\/\//, '');
    }
}
