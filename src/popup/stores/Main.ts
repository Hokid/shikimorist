import {action, computed, observable} from 'mobx';
import * as AsyncMirror from '@redtea/async-mirror';
import {decorate, inject, injectable} from 'inversify';
import {AnimePageClient} from '../../core/anime-page/AnimePageClient';
import {AnimeRates} from '../../core/anime-rate/AnimeRates';
import {Animes} from '../../core/animes/Animes';
import {TYPES} from '../../iocTypes';
import {AsyncState} from '@redtea/async-mirror';
import {IAnime} from '../../core/api/animes';
import {IRate, RateStatus} from '../../core/api/usersRate';
import {AnimeRate} from '../../core/anime-rate/AnimeRate';

@injectable()
export class MainStore {
    @observable animeName: AsyncState<string | null, Error> = AsyncMirror.pending();
    @observable anime: AsyncState<IAnime | null, Error> = AsyncMirror.pending();
    @observable animeRateSnapshot: Omit<IRate, 'target_id'> | null = null;
    @observable animeRate: AsyncState<Omit<IRate, 'target_id'> | null, Error> = AsyncMirror.pending();

    private animeRateModel: AnimeRate | null = null;

    constructor(
        private animes: Animes,
        private animeRates: AnimeRates,
        private pageClient = new AnimePageClient(),
    ) {}

    @computed get error() {
        return this.animeName.reason || this.anime.reason || this.animeRate.reason;
    }

    @computed get isPending() {
        return (
            this.animeName.isPending
            || this.anime.isPending
            || this.animeRate.isPending
        );
    }

    @computed get isRateUpdating() {
        return this.animeRate.isPending && !!this.animeRateSnapshot;
    }

    @computed get rate(): Omit<IRate, 'target_id'> | null {
        return this.animeRate.isFulfilled
            ? this.animeRate.value
            : this.animeRateSnapshot;
    }

    @computed get hasAnime() {
        return !!(this.anime.isFulfilled && this.anime.value);
    }

    @computed get hasRate() {
        return !!this.rate;
    }

    @action
    async requestForAnime() {
        this.animeName = AsyncMirror.pending();
        this.anime = AsyncMirror.pending();
        this.animeRate = AsyncMirror.pending();
        this.animeRateSnapshot = null;

        try {
            const pageData = await this.pageClient.request();
            const anime = pageData
                ? await this.animes.search(pageData.name)
                : null;
            const rate = anime
                ? await this.animeRates.getByAnimeId(anime.id)
                : null;

            this.animeName = AsyncMirror.resolve(pageData ? pageData.name : null);
            this.anime = AsyncMirror.resolve(anime);
            this.animeRate = AsyncMirror.resolve(this.getRateAsObject(rate));
            this.animeRateModel = rate;
        } catch(error) {
            this.animeName = AsyncMirror.reject(error);
            this.anime = AsyncMirror.reject(error);
            this.animeRate = AsyncMirror.reject(error);
        }
    }

    @action
    async addAnimeToRateList() {
        if (this.anime.isFulfilled && this.anime.value) {
            const {id} = this.anime.value;
            this.animeRate = AsyncMirror.pending();

            try {
                const rate = await this.animeRates.create(id);
                this.animeRate = AsyncMirror.resolve(this.getRateAsObject(rate));
                this.animeRateModel = rate;
            } catch(error) {
                this.animeRate = AsyncMirror.reject(error);
            }
        }
    }

    @action
    async removeAnimeFromRateList() {
        if (this.anime.isFulfilled && this.animeRate.value && this.animeRateModel) {
            try {
                await this.animeRateModel.delete();
                this.animeRate = AsyncMirror.resolve(null);
            } catch(error) {
                this.animeRate = AsyncMirror.reject(error);
            }

            this.animeRateModel = null;
        }
    }

    @action
    async setRateStatus(status: RateStatus) {
        if (this.animeRate.isFulfilled && this.animeRate.value && this.animeRateModel) {
            this.animeRateSnapshot = this.animeRate.value;
            this.animeRate = AsyncMirror.pending();

            try {
                await this.animeRateModel.setStatus(status);
                this.animeRate = AsyncMirror.resolve(this.getRateAsObject(this.animeRateModel));
            } catch(error) {
                this.animeRate = AsyncMirror.reject(error);
            }

            this.animeRateSnapshot = null;
        }
    }

    @action
    async setRateScore(score: number) {
        if (this.animeRate.isFulfilled && this.animeRate.value && this.animeRateModel) {
            this.animeRateSnapshot = this.animeRate.value;
            this.animeRate = AsyncMirror.pending();

            try {
                await this.animeRateModel.setScore(score);
                this.animeRate = AsyncMirror.resolve(this.getRateAsObject(this.animeRateModel));
            } catch (error) {
                this.animeRate = AsyncMirror.reject(error);
            }

            this.animeRateSnapshot = null;
        }
    }

    @action
    async setRateRewatches(rewatches: number) {
        if (this.animeRate.isFulfilled && this.animeRate.value && this.animeRateModel) {
            this.animeRateSnapshot = this.animeRate.value;
            this.animeRate = AsyncMirror.pending();

            try {
                await this.animeRateModel.setRewatches(rewatches);
                this.animeRate = AsyncMirror.resolve(this.getRateAsObject(this.animeRateModel));
            } catch (error) {
                this.animeRate = AsyncMirror.reject(error);
            }

            this.animeRateSnapshot = null;
        }
    }

    @action
    async incrementRateEpisodes() {
        if (this.animeRate.isFulfilled && this.animeRate.value && this.animeRateModel) {
            this.animeRateSnapshot = this.animeRate.value;
            this.animeRate = AsyncMirror.pending();

            try {
                await this.animeRateModel.increaseEpisodes();
                this.animeRate = AsyncMirror.resolve(this.getRateAsObject(this.animeRateModel));
            } catch (error) {
                this.animeRate = AsyncMirror.reject(error);
            }

            this.animeRateSnapshot = null;
        }
    }

    @action
    async decrementRateEpisodes() {
        if (this.animeRate.isFulfilled && this.animeRate.value && this.animeRateModel) {
            this.animeRateSnapshot = this.animeRate.value;
            this.animeRate = AsyncMirror.pending();

            try {
                await this.animeRateModel.decreaseEpisodes();
                this.animeRate = AsyncMirror.resolve(this.getRateAsObject(this.animeRateModel));
            } catch (error) {
                this.animeRate = AsyncMirror.reject(error);
            }

            this.animeRateSnapshot = null;
        }
    }

    @action
    async setRateEpisodes(episodes: number) {
        if (this.animeRate.isFulfilled && this.animeRate.value && this.animeRateModel) {
            this.animeRateSnapshot = this.animeRate.value;
            this.animeRate = AsyncMirror.pending();

            try {
                await this.animeRateModel.setEpisodes(episodes);
                this.animeRate = AsyncMirror.resolve(this.getRateAsObject(this.animeRateModel));
            } catch (error) {
                this.animeRate = AsyncMirror.reject(error);
            }
            this.animeRateSnapshot = null;
        }
    }

    private getRateAsObject(rate: AnimeRate | null): Omit<IRate, 'target_id'> | null {
        if (rate) {
            return {
                id: rate.id,
                episodes: rate.episodes,
                rewatches: rate.rewatches,
                score: rate.score,
                status: rate.status,
            };
        }

        return null;
    }
}

decorate(inject(TYPES.Animes) as ParameterDecorator, MainStore, 0);
decorate(inject(TYPES.AnimeRates) as ParameterDecorator, MainStore, 1);
