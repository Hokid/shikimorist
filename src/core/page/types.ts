import {IAnime} from '../api/animes';

export type PageLookupName = {
    type: 'name';
    value: string;
}

export type PageLookupAnime = {
    type: 'anime';
    value: IAnime;
}

export type PageLookupResult = PageLookupName | PageLookupAnime;
