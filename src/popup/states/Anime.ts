import {IAuthorizationState, IErrorState, ILoaderState, IScreenState, Screens} from './types';
import {observable} from 'mobx';
import {IRate, RateStatus} from '../../core/api/usersRate';
import {IAnime} from '../../core/api/animes';
import {AnimeRate} from '../../core/anime-rate/AnimeRate';
import {AnimeContextClient} from '../../core/anime-context/AnimeContextClient';
import {Animes} from '../../core/animes/Animes';
import {AnimeRates} from '../../core/anime-rate/AnimeRates';
import {Lockable} from './base/Lockable';
import {ChromeRuntimeBus} from '../../core/messager/bus-library/chrome-runtime/chrome-runtime-bus';
import {ChanelFactory} from '../../core/messager/ChanelFactory';

export class AnimeState extends Lockable {
    isLock: boolean = false;

    @observable animeLookupName?: string | undefined;
    @observable anime?: IAnime | undefined;
    @observable isRateUpdating: boolean = false;
    @observable rate?: IRate | undefined;

    constructor(
        private stateMediator: ILoaderState & IAuthorizationState & IErrorState & IScreenState,
        private animes: Animes,
        private animeRates: AnimeRates,
        public shikimoriHost: string,
        private pageClient = new AnimeContextClient(
            new ChanelFactory(
                new ChromeRuntimeBus({
                    sendMethod: 'currentTab'
                })
            )
        ),
    ) {
        super();

        this.setLock(!stateMediator.isAuthorized());

        stateMediator.onAuthorization(status => {
            if (!status) {
                this.runInAction(() => {
                    this.animeLookupName = undefined;
                    this.anime = undefined;
                    this.isRateUpdating = false;
                    this.rate = undefined;
                });
            }

            this.setLock(!stateMediator.isAuthorized());
        });
    }

    async lookup() {
        const catchError = this.stateMediator.getScopedErrorCatcher();
        const stopLoader = this.stateMediator.startLoader();

        try {
            const data = await this._lookup();
            stopLoader();
            await this.setAnime(data.anime, data.lookupName);
        } catch (error) {
            stopLoader();
            catchError(error, () => this.lookup());
        }
    }

    async _lookup(): Promise<{anime?: IAnime, lookupName?: string}> {
        let anime: IAnime | undefined;
        let lookupName: string | undefined;

        const pageData = await this.pageClient.getAnimeDescription();

        if (pageData) {
            if (pageData.type === 'full') {
                const {id} = pageData.value;
                anime = await this.animes.getById(id);
                if (!anime) {
                    await this.pageClient.setAnimeDescription(undefined);
                    return this._lookup();
                }
            } else if (pageData.type === 'name') {
                lookupName = pageData.value;

                const searchResult = await this.animes
                    .search(pageData.value, 1);

                if (searchResult.length > 0) {
                    anime = searchResult[0];
                }
            }
        }

        return {anime, lookupName};
    }

    async setAnime(anime?: IAnime | undefined, animeLookupName?: string) {
        const catchError = this.stateMediator.getScopedErrorCatcher();
        const stopLoader = this.stateMediator.startLoader();

        try {
            await this.pageClient.setAnimeDescription(anime);

            const rate = anime
                ? await this.animeRates.getByAnimeId(anime.id)
                : null;

            this.runInAction(() => {
                if (animeLookupName) {
                    this.animeLookupName = animeLookupName;
                }

                this.anime = anime;
                this.rate = rate ? rate.getData() : undefined;
            });

            stopLoader();

            if (rate) {
                this.stateMediator.gotoScreen(Screens.RATE_CONTROL);
            } else if (anime) {
                this.stateMediator.gotoScreen(Screens.ADD_TO_LIST);
            } else {
                this.stateMediator.gotoScreen(Screens.EMPTY);
            }
        } catch (error) {
            stopLoader();
            catchError(error, () => this.lookup());
        }
    }

    async addAnimeToRateList(status: RateStatus) {
        const catchError = this.stateMediator.getScopedErrorCatcher();
        const stopLoader = this.stateMediator.startLoader();

        try {
            const rate = await this.animeRates.create(this.anime!.id, status);

            stopLoader();

            this.runInAction(() => {
                this.rate = rate.getData();
            });

            this.stateMediator.gotoScreen(Screens.RATE_CONTROL);
        } catch (error) {
            stopLoader();
            catchError(error, () => this.lookup());
        }
    }

    async removeAnimeFromRateList() {
        const catchError = this.stateMediator.getScopedErrorCatcher();
        const stopLoader = this.stateMediator.startLoader();

        try {
            const rate = this.animeRates.getRateModelFromData(this.rate!);

            await rate.delete();

            stopLoader();

            this.stateMediator.gotoScreen(Screens.ADD_TO_LIST);

            this.runInAction(() => {
                this.rate = undefined;
            });
        } catch (error) {
            stopLoader();
            catchError(error, () => this.removeAnimeFromRateList());
        }
    }

    async setRateStatus(status: RateStatus) {
        await this.wrapRateUpdate(async rate => {
            await rate.setStatus(status);
        });
    }

    async setRateScore(score: number) {
        await this.wrapRateUpdate(async rate => {
            await rate.setScore(score);
        });
    }

    async incrementRateRewatches() {
        await this.wrapRateUpdate(async rate => {
            await rate.setRewatches(rate.rewatches + 1);
        });
    }

    async decrementRateRewatches() {
        await this.wrapRateUpdate(async rate => {
            await rate.setRewatches(rate.rewatches - 1);
        });
    }

    async setRateRewatches(rewatches: number) {
        await this.wrapRateUpdate(async rate => {
            await rate.setRewatches(rewatches);
        });
    }

    async incrementRateEpisodes() {
        await this.wrapRateUpdate(async rate => {
            await rate.increaseEpisodes();
        });
    }

    async decrementRateEpisodes() {
        await this.wrapRateUpdate(async rate => {
            await rate.decreaseEpisodes();
        });
    }

    async setRateEpisodes(episodes: number) {
        await this.wrapRateUpdate(async rate => {
            await rate.setEpisodes(episodes);
        });
    }

    private async wrapRateUpdate(updater: (rate: AnimeRate) => Promise<void>) {
        const catchError = this.stateMediator.getScopedErrorCatcher();

        this.runInAction(() => {
            this.isRateUpdating = true;
        });

        try {
            const rate = this.animeRates.getRateModelFromData(this.rate!);

            await updater(rate);

            this.runInAction(() => {
                this.isRateUpdating = false;
                this.rate = rate.isDelete ? undefined : rate.getData();
            });
        } catch (error) {
            this.runInAction(() => {
                this.isRateUpdating = false;
            });
            catchError(error, () => this.wrapRateUpdate(updater));
        }
    }
}
