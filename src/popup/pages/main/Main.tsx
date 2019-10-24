import React, {Component} from 'react';
import {IAnime} from '../../../core/api/animes';
import * as AsyncMirror from '@redtea/async-mirror';
import {AsyncState, Fulfilled} from '@redtea/async-mirror';
import {authContext, IAuthContext} from '../../contexts/Authorization';
import {TakeContexts} from '../../contexts/TakeContext';
import {TYPES} from '../../../iocTypes';
import {resolve} from 'inversify-react';
import {RateStatus} from '../../../core/api/usersRate';
import {AnimeRate} from '../../../core/anime-rate/AnimeRate';
import {Animes} from '../../../core/animes/Animes';
import {AnimeRates} from '../../../core/anime-rate/AnimeRates';
import {AddToList} from './screens/add-to-list/AddToList';
import {RateControl} from './screens/rate-control/RateControl';
import {Empty} from './screens/empty/Empty';
import {AnimePageClient} from '../../../core/anime-page/AnimePageClient';
import {PageLookupResult} from '../../../core/anime-page/types';
import {Loader} from './screens/loader/Loader';
import {ErrorScreen} from './screens/error/Error';
import {SignIn} from './screens/sign-in/SignIn';


type Props = {
    authContext: IAuthContext;
};
type State = {
    page: AsyncState<PageLookupResult | null>;
    anime: AsyncState<IAnime | null>;
    rate: AsyncState<AnimeRate | null>;
    updating: boolean;
};

export class MainPageBase extends Component<Props, State> {
    @resolve(TYPES.Animes)
    animes!: Animes;

    @resolve(TYPES.AnimeRates)
    animeRates!: AnimeRates;

    @resolve(TYPES.config.shikimoriHost)
    shikimoriHost!: string;

    animePage = new AnimePageClient();

    state: State = {
        page: AsyncMirror.pending(),
        anime: AsyncMirror.pending(),
        rate: AsyncMirror.pending(),
        updating: false
    };

    componentDidMount() {
        this.tryUpdate();
    }

    render() {
        if (!this.props.authContext.isAuthorized) {
            return (
                <SignIn/>
            );
        }

        const {page, anime, rate} = this.state;

        if (page.isPending || anime.isPending || rate.isPending) {
            return (
                <Loader/>
            );
        }

        if (page.isRejected || anime.isRejected || rate.isRejected) {
            return (
                <ErrorScreen
                    onUpdate={() => this.tryUpdate()}
                />
            );
        }

        if (!page.value || !anime.value) {
            return (
                <Empty/>
            );
        }

        if (!rate.value) {
            return (
                <AddToList
                    anime={anime.value}
                    onAdd={this.onAddToList}
                />
            );
        }

        return (
            <RateControl
                value={rate.value}
                anime={anime.value}
                shikimoriHost={this.shikimoriHost}
                maxEpisodes={anime.value.episodes}
                updating={this.state.updating}
                onChangeStatus={this.onChangeStatus}
                onIncrementEp={this.onIncrementEp}
                onDecrementEp={this.onDecrementEp}
                onChangeScore={this.onChangeScore}
                onChangeRewatches={this.onChangeRewatches}
                onDelete={this.onDelete}
            />
        );
    }

    onAddToList = async () => {
        const anime = (this.state.anime as Fulfilled<IAnime>).value;

        const rate = await this.animeRates.create(anime.id);

        this.setState({
            rate: AsyncMirror.resolve(rate)
        });
    };

    onChangeStatus = async (status: RateStatus) => {
        const rate = (this.state.rate as Fulfilled<AnimeRate>).value;

        this.setState({
            updating: true
        });

        try {
            await rate.setStatus(status);
            this.setState({
                updating: false,
                rate: AsyncMirror.resolve(rate.clone())
            });
        } catch (error) {
            console.error(error);
            this.setState({
                updating: false
            });
        }
    };

    onChangeScore = async (score: number) => {
        const rate = (this.state.rate as Fulfilled<AnimeRate>).value;

        this.setState({
            updating: true
        });

        try {
            await rate.setScore(score);
            this.setState({
                updating: false,
                rate: AsyncMirror.resolve(rate.clone())
            });
        } catch (error) {
            console.error(error);
            this.setState({
                updating: false
            });
        }
    };

    onChangeRewatches = async (rewatches: number) => {
        const rate = (this.state.rate as Fulfilled<AnimeRate>).value;

        this.setState({
            updating: true
        });

        try {
            await rate.setRewatches(rewatches);
            this.setState({
                updating: false,
                rate: AsyncMirror.resolve(rate.clone())
            });
        } catch (error) {
            console.error(error);
            this.setState({
                updating: false
            });
        }
    };

    onIncrementEp = async () => {
        const rate = (this.state.rate as Fulfilled<AnimeRate>).value;

        this.setState({
            updating: true
        });

        try {
            await rate.increaseEpisodes();
            this.setState({
                updating: false,
                rate: AsyncMirror.resolve(rate.clone())
            });
        } catch (error) {
            console.error(error);
            this.setState({
                updating: false
            });
        }
    };

    onDecrementEp = async () => {
        const rate = (this.state.rate as Fulfilled<AnimeRate>).value;

        this.setState({
            updating: true
        });

        try {
            await rate.decreaseEpisodes();
            this.setState({
                updating: false,
                rate: AsyncMirror.resolve(rate.clone())
            });
        } catch (error) {
            console.error(error);
            this.setState({
                updating: false
            });
        }
    };

    onDelete = async () => {
        if (this.hasRate()) {
            const rate = (this.state.rate as Fulfilled<AnimeRate>).value;
            await this.animeRates.delete(rate.id);
            this.setState({
                rate: AsyncMirror.resolve(null)
            });
        }
    };

    async tryUpdate() {
        this.setState({
            page: AsyncMirror.pending(),
            anime: AsyncMirror.pending(),
            rate: AsyncMirror.pending(),
        });

        try {
            const response = await this.animePage.request();
            console.log(1);
            const anime = response
                ? await this.animes.search(response.name)
                : null;
            console.log(anime);
            const rate = anime
                ? await this.animeRates.getByAnimeId(anime.id)
                : null;
            console.log(1);

            this.setState({
                page: AsyncMirror.resolve(response),
                anime: AsyncMirror.resolve(anime),
                rate: AsyncMirror.resolve(rate),
            });
        } catch (error) {
            console.log(error);
            this.setState({
                page: AsyncMirror.reject(error),
                anime: AsyncMirror.reject(error),
                rate: AsyncMirror.reject(error),
            });
        }
    };

    hasAnime() {
        const {anime} = this.state;
        return anime.isFulfilled && !!anime.value;
    }

    hasRate() {
        const {rate} = this.state;
        return rate.isFulfilled && !!rate.value;
    }
}

export function MainPage(props: Omit<Props, 'authContext'>) {
    return (
        <TakeContexts
            contexts={{
                authContext
            }}
            to={MainPageBase}
            props={props}
        />
    );
}
