import {IAnimeState, IAuthorizationState, IErrorState} from './types';
import {Animes} from '../../core/animes/Animes';
import {observable} from 'mobx';
import {Lockable} from './base/Lockable';
import {IAnime} from '../../core/api/animes';

export class SearchingState extends Lockable {
    @observable isSearching: boolean = false;
    @observable defaultSearchQuery: string | undefined;
    @observable result: IAnime[] | undefined;

    constructor(
        private stateMediator: IAnimeState & IAuthorizationState & IErrorState,
        private animes: Animes
    ) {
        super();

        this.setLock(!stateMediator.isAuthorized());

        stateMediator.onAuthorization(status => {
            if (!status) {
                this.runInAction(() => {
                    this.isSearching = false;
                    this.defaultSearchQuery = undefined;
                    this.result = undefined;
                });
            }

            this.setLock(!status);
        });

        stateMediator.onAnimeLookupName(name => {
            this.runInAction(() => {
                this.defaultSearchQuery = name;
            });
        });

        stateMediator.onAnime(anime => {
            this.runInAction(() => {
                this.defaultSearchQuery = anime
                    ? anime.name
                    : undefined;
            });
        });
    }

    async search(query = this.defaultSearchQuery) {
        if (!query) {
            return;
        }

        const setError = this.stateMediator.getScopedErrorCatcher();

        this.runInAction(() => {
            this.isSearching = true;
            this.result = undefined;
        });

        try {
            const result = await this.animes.search(query || '', 3);
            this.runInAction(() => {
               this.isSearching = false;
               this.result = result;
            });
        } catch (error) {
            this.runInAction(() => {
                this.isSearching = false;
            });

            setError(error, () => this.search(query));
        }
    }

    async onSelect(anime: IAnime) {
        await this.stateMediator.setAnime(anime);
    }
}
