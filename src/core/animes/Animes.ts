import {AnimesApi, IAnime} from '../api/animes';
import {decorate, inject, injectable} from 'inversify';
import {TYPES} from '../../iocTypes';

@injectable()
export class Animes {
    constructor(
        private api: AnimesApi
    ) {
    }

    async search(name: string, limit = 5): Promise<IAnime[]> {
        return this.api.search(name, limit);
    }

    async getById(id: number): Promise<IAnime | undefined> {
        return this.api.getById(id);
    }
}

decorate(inject(TYPES.AnimesApi) as ParameterDecorator, Animes, 0);
