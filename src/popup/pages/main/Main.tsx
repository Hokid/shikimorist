import React, {Component} from 'react';
import {IAnime} from '../../../core/api/animes';
import * as AsyncMirror from '@redtea/async-mirror';
import {AsyncState, Fulfilled} from '@redtea/async-mirror';
import {authContext, IAuthContext} from '../../contexts/Authorization';
import {TakeContexts} from '../../contexts/TakeContext';
import {TYPES} from '../../../iocTypes';
import {resolve} from 'inversify-react';
import {IRate, RateStatus} from '../../../core/api/usersRate';
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
import {MainStore} from '../../stores/Main';
import {inject, observer} from 'mobx-react';


type Props = {
    authContext: IAuthContext;
    mainStore: MainStore;
};
type State = {
    page: AsyncState<PageLookupResult | null>;
    anime: AsyncState<IAnime | null>;
    rate: AsyncState<AnimeRate | null>;
    updating: boolean;
};

@inject('mainStore')
@observer
export class MainPageBase extends Component<Props, State> {
    @resolve(TYPES.config.shikimoriHost)
    shikimoriHost!: string;

    async componentDidMount() {
        if (this.props.authContext.isAuthorized) {
            await this.props.mainStore.requestForAnime();
        }
    }

    render() {
        if (!this.props.authContext.isAuthorized) {
            return (
                <SignIn/>
            );
        }

        const {
            isPending,
            isRateUpdating,
            error,
            rate,
            hasAnime,
            hasRate,
            anime,
        } = this.props.mainStore;

        if (error) {
            return (
                <ErrorScreen
                    onUpdate={
                        () => this.props.mainStore.requestForAnime()
                    }
                />
            );
        }

        if (isPending && !isRateUpdating) {
            return (
                <Loader/>
            );
        }

        if (!hasAnime) {
            return (
                <Empty/>
            );
        }

        const animeData = anime.value as IAnime;

        if (!hasRate) {
            return (
                <AddToList
                    anime={animeData}
                    onAdd={this.onAddToList}
                />
            );
        }

        return (
            <RateControl
                value={rate as Omit<IRate, 'target_id'>}
                anime={animeData}
                shikimoriHost={this.shikimoriHost}
                maxEpisodes={animeData.episodes}
                updating={isRateUpdating}
                onChangeStatus={this.onChangeStatus}
                onIncrementEp={this.onIncrementEp}
                onDecrementEp={this.onDecrementEp}
                onChangeScore={this.onChangeScore}
                onChangeRewatches={this.onChangeRewatches}
                onDelete={this.onDelete}
            />
        );
    }

    onAddToList = async (status: RateStatus) => {
        await this.props.mainStore.addAnimeToRateList(status);
    };

    onChangeStatus = async (status: RateStatus) => {
        await this.props.mainStore.setRateStatus(status);
    };

    onChangeScore = async (score: number) => {
        await this.props.mainStore.setRateScore(score);
    };

    onChangeRewatches = async (rewatches: number) => {
        await this.props.mainStore.setRateRewatches(rewatches);
    };

    onIncrementEp = async () => {
        await this.props.mainStore.incrementRateEpisodes();
    };

    onDecrementEp = async () => {
        await this.props.mainStore.decrementRateEpisodes();
    };

    onDelete = async () => {
        await this.props.mainStore.removeAnimeFromRateList();
    };
}

export function MainPage(props: Omit<Props, 'authContext' | 'mainStore'>) {
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
