import {Anime} from './data/anime';

export interface AnimeApi {
    search(token: string, limit?: number): Promise<Anime[]> ;
    getById(id: number): Promise<Anime>;
}
