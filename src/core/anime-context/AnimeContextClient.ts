import {AnimeDescriptionFull, AnimeDescriptionRequestResult} from './anime-description';
import {ensureInstalled} from './anime-context-server-installer';
import {AnimeDescriptionRequestMessage, SetAnimeDescriptionRequestMessage} from './chanel/messages';
import {ChanelFactory} from '../messager/ChanelFactory';
import {Chanel} from '../messager/Chanel';
import {ANIME_DESCIPTION_CONTEXT_CHANEL} from './chanel/chanel';


export class AnimeContextClient {
    private chanel: Chanel;

    constructor(chanelFactory: ChanelFactory) {
        this.chanel = chanelFactory.create(ANIME_DESCIPTION_CONTEXT_CHANEL);
    }

    async getAnimeDescription(): Promise<AnimeDescriptionRequestResult | null> {
        await ensureInstalled();

        const message = new AnimeDescriptionRequestMessage();

        return this.chanel.send(message, true);
    }

    async setAnimeDescription(description: AnimeDescriptionFull | undefined): Promise<void> {
        await ensureInstalled();
        
        const message = new SetAnimeDescriptionRequestMessage(
            description
                ? {
                    id: description.id
                }
                : undefined
        );

        return this.chanel.send(message, true);
    }
}
