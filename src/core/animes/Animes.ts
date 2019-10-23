import {AnimesApi, IAnime} from '../api/animes';
import {decorate, inject, injectable} from 'inversify';
import {TYPES} from '../../iocTypes';

@injectable()
export class Animes {
    constructor(
        private api: AnimesApi
    ) {
    }

    async search(name: string): Promise<IAnime | null> {
        return this.api.search(name);
    }
}

decorate(inject(TYPES.AnimesApi) as ParameterDecorator, Animes, 0);
