import {AnimeDescriptionFull, AnimeDescriptionRequestResult} from './anime-description';
import {AnimeDescriptionRequestMessage, SetAnimeDescriptionRequestMessage} from './chanel/messages';
import {ChanelFactory} from '../messager/ChanelFactory';
import {ANIME_DESCIPTION_CONTEXT_CHANEL} from './chanel/chanel';
import {Client} from '../remote-server/Client';


export class AnimeContextClient extends Client {
    constructor(chanelFactory: ChanelFactory) {
        super(chanelFactory.create(ANIME_DESCIPTION_CONTEXT_CHANEL));
    }

    async getAnimeDescription(): Promise<AnimeDescriptionRequestResult> {
        const message = new AnimeDescriptionRequestMessage();

        return this.sendCommand(message);
    }

    async setAnimeDescription(description: AnimeDescriptionFull | undefined): Promise<void> {
        const message = new SetAnimeDescriptionRequestMessage(
            description
                ? {
                    id: description.id
                }
                : undefined
        );

        return this.sendCommand(message);
    }
}
