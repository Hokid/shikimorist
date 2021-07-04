import {Message} from '../../messager/message';
import {AnimeDescriptionFull, AnimeDescriptionRequestResult} from '../anime-description';



export class SetAnimeDescriptionRequestMessage extends Message<'set-anime', AnimeDescriptionFull | undefined, void> {
    constructor(description?: AnimeDescriptionFull) {
        super('set-anime', description);
    }
}

export class AnimeDescriptionRequestMessage extends Message<'anime-info', void, AnimeDescriptionRequestResult> {
    constructor() {
        super('anime-info');
    }
}
