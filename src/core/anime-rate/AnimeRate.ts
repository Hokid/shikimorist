import {IRate, RateStatus, UsersRateApi} from '../api/usersRate';

export class AnimeRate {
    isDelete: boolean = false;

    constructor(
        private data: IRate,
        private api: UsersRateApi
    ) {
        this.data = {...data};
    }

    get id(): number {
        return this.data.id;
    }

    get episodes(): number {
        return this.data.episodes;
    }

    get score(): number {
        return this.data.score;
    }

    get rewatches(): number {
        return this.data.rewatches;
    }

    get status(): RateStatus {
        return this.data.status;
    }

    getData(): IRate {
        return {...this.data};
    }

    async increaseEpisodes(): Promise<number> {
        const current = await this.api.getById(this.data.id);

        if (current) {
            const result = await this.api.update(this.data.id, {
                episodes: current.episodes + 1
            });

            this.data = result;
        }

        return this.data.episodes;
    }

    async decreaseEpisodes(): Promise<number> {
        const current = await this.api.getById(this.data.id);

        if (current) {
            const result = await this.api.update(this.data.id, {
                episodes: current.episodes - 1
            });

            this.data = result;
        }

        return this.data.episodes;
    }

    async setEpisodes(episodes: number): Promise<number> {
        const result = await this.api.update(this.data.id, {
            episodes
        });

        this.data = result;

        return this.data.episodes;
    }

    async setStatus(status: RateStatus): Promise<RateStatus> {
        const result = await this.api.update(this.data.id, {
            status
        });

        this.data = result;

        return this.data.status;
    }

    async setScore(score: number): Promise<number> {
        const result = await this.api.update(this.data.id, {
            score
        });

        this.data  = result;

        return this.data.score;
    }

    async setRewatches(rewatches: number): Promise<number> {
        const result = await this.api.update(this.data.id, {
            rewatches
        });

        this.data = result;

        return this.data.rewatches;
    }

    async delete() {
        await this.api.delete(this.data.id);

        this.isDelete = true;
    }

    clone(): AnimeRate {
        return new AnimeRate({...this.data}, this.api);
    }
}
