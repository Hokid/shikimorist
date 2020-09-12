import {Message} from '../messager/message';
import {PageLookupResult} from './types';

export class SetAnimeMessage extends Message<'set-anime', {id: number} | undefined, void> {
    constructor(value?: {id: number}) {
        super(
            'set-anime',
            value
        );
    }
}

export class AnimeInfoMessage extends Message<'anime-info', void, PageLookupResult | null> {
    constructor() {
        super(
            'anime-info'
        );
    }
}
