import React, {Component} from 'react';
import {Message, PingPage} from '../../../core/messages';
import {AnimesApi, IAnime} from '../../../core/api/animes';
import {AsyncState, Fulfilled} from '@redtea/async-mirror';
import {authContext, IAuthContext} from '../../contexts/Authorization';
import {TakeContexts} from '../../contexts/TakeContext';
import * as AsyncMirror from '@redtea/async-mirror';
import {TYPES} from '../../../iocTypes';
import {resolve} from 'inversify-react';
import {IRate, RateStatus, UsersRateApi} from '../../../core/api/usersRate';
import {AnimeRate} from '../../../core/anime-rate/AnimeRate';
import {Animes} from '../../../core/animes/Animes';
import {AnimeRates} from '../../../core/anime-rate/AnimeRates';
import {AddToList} from './screens/add-to-list/AddToList';
import {RateControl} from './screens/rate-control/RateControl';


type Props = {
    authContext: IAuthContext;
};
type State = {
    anime: AsyncState<IAnime | null, string> | null;
    rate: AsyncState<AnimeRate | null, string> | null;
    updating: boolean;
};

export class MainPageBase extends Component<Props, State> {
    @resolve(TYPES.Animes)
    animes!: Animes;

    @resolve(TYPES.AnimeRates)
    animeRates!: AnimeRates;

    state: State = {
        anime: null,
        rate: null,
        updating: false
    };

    componentDidMount() {
        chrome.runtime.onMessage.addListener(this.onMessage);
        chrome.tabs.query({active: true, currentWindow: true},tabs => {
            if (tabs[0]) {
                console.log('ping');
                chrome.tabs.sendMessage(tabs[0].id as number, {
                    event: 'pingPage'
                } as PingPage);
            }
        });
    }

    componentWillUnmount() {
        chrome.runtime.onMessage.removeListener(this.onMessage);
    }

    render() {
        if (!this.props.authContext.isAuthorized) {
            return (
                <button onClick={this.props.authContext.signIn}>Войти</button>
            );
        }

        const {anime} = this.state;

        return (
            <>
                {
                    (!anime || (anime.isFulfilled && !anime.value)) && (
                        'Ничего нет'
                    )
                }
                {
                    !!anime && anime.isRejected && (
                        'Ошибка'
                    )
                }
                {this.renderAddToList()}
                {this.renderRateControl()}
            </>
        );
    }

    renderAddToList() {
        if (this.hasAnime() && !this.hasRate()) {
            return (
                <AddToList
                    onAdd={this.onAddToList}
                />
            )
        }

        return null;
    }

    renderRateControl() {
        if (this.hasAnime() && this.hasRate()) {
            const rate = (this.state.rate as Fulfilled<AnimeRate>).value;
            const anime = (this.state.anime as Fulfilled<IAnime>).value;

            return (
                <RateControl
                    value={rate}
                    maxEpisodes={anime.episodes}
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

        return null;
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
        } catch(error) {
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
                rate: null
            });
        }
    };

    onMessage = (message: Message) => {
        if (message.event === 'clear') {
            this.setState({
                anime: null
            });
        } else if (message.event === 'got_name') {
            this.search(message.data);
        }
    };

    async search(name: string) {
        this.setState({
            anime: AsyncMirror.pending(),
            rate: AsyncMirror.pending()
        });

        try {
            const anime = await this.animes.search(name);
            const rate = anime
                ? await this.animeRates.getByAnimeId(anime.id)
                : null;

            this.setState({
                anime: AsyncMirror.resolve(anime),
                rate: AsyncMirror.resolve(rate),
            });
        } catch(error) {
            console.error(error);
            this.setState({
                anime: AsyncMirror.reject(error.message),
                rate: AsyncMirror.reject(error.message),
            });
        }
    }


    hasAnime() {
        const {anime} = this.state;
        return !!anime && anime.isFulfilled && !!anime.value;
    }

    hasRate() {
        const {rate} = this.state;
        return !!rate && rate.isFulfilled && !!rate.value;
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
