import {IReactionDisposer, reaction, when} from 'mobx';
import {decorate, inject, injectable} from 'inversify';
import {AnimeRates} from '../../core/anime-rate/AnimeRates';
import {Animes} from '../../core/animes/Animes';
import {TYPES} from '../../iocTypes';
import {IAnime} from '../../core/api/animes';
import {ScreenState} from './Screen';
import {AuthorizationState} from './Authorization';
import {AuthorizationApi} from '../../core/api/authorization/Auhtorization';
import {LoaderState} from './Loader';
import {IAnimeState, IAuthorizationState, IErrorState, ILoaderState, IScreenState, Screens} from './types';
import {AnimeState} from './Anime';
import {ErrorState} from './Error';
import {SearchingState} from './Searching';
import {isAuthorizationApiError} from '../../core/api/authorization/utils';

interface IMainState extends
    ILoaderState,
    IAuthorizationState,
    IErrorState,
    IAnimeState,
    IScreenState {}

@injectable()
export class MainState implements IMainState {
    error: ErrorState;
    loader: LoaderState;
    authorization: AuthorizationState;
    screens: ScreenState;
    anime: AnimeState;
    searching: SearchingState;
    isInitialized: boolean = false;

    constructor(
        private animes: Animes,
        private animeRates: AnimeRates,
        private authApi: AuthorizationApi,
        public shikimoriHost: string
    ) {
        this.error = new ErrorState();
        this.screens = new ScreenState();
        this.loader = new LoaderState();
        this.authorization = new AuthorizationState(this, authApi);
        this.anime = new AnimeState(
            this,
            animes,
            animeRates,
            shikimoriHost
        );
        this.searching = new SearchingState(this, animes);
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        this.isInitialized = true;

        this.onLoading(status => {
            if (status) {
                this.screens.push(Screens.LOADER);
            } else {
                this.screens.goBack();
            }
        });

        reaction(
            () => this.error.error,
            (error) => {
                if (error) {
                    if (!isAuthorizationApiError(error)) {
                        this.screens.push(Screens.ERROR);
                    }
                } else if (this.screens.current === Screens.ERROR) {
                    this.screens.goBack();
                }
            }
        );

        this.onAuthorization(
            (isAuthorized) => {
                if (isAuthorized) {
                    this.anime.lookup();
                } else {
                    this.screens.push(Screens.SIGN_IN);
                }
            }
        );

        await this.authorization.getReady();

        if (!this.isAuthorized()) {
            this.screens.push(Screens.SIGN_IN);
        }
    }

    startLoader() {
        return this.loader.addLoader();
    }

    onLoading(_reaction: (status: boolean) => any): IReactionDisposer {
        return reaction(
            () => this.loader.isLoading,
            status => _reaction(status)
        );
    }

    onAuthorization(_reaction: (status: boolean) => any): IReactionDisposer {
        return reaction(
            () => this.authorization.isAuthorized,
            status => _reaction(status)
        );
    }

    isAuthorized() {
        return this.authorization.isAuthorized;
    }

    getScopedErrorCatcher(scope: Screens | void = this.currentScreen()) {
        return (error: Error | string, repeater: () => any) => {
            this.catchError(error, repeater, scope);
        };
    }

    catchError(error: Error | string, repeater: () => any, scope: Screens | void) {
        if (this.screens.current === scope) {
            this.error.setError(error, repeater);
        }
    }

    onAnime(_reaction: (anime: (IAnime | undefined)) => any): IReactionDisposer {
        return reaction(
            () => this.anime.anime,
            anime => _reaction(anime)
        );
    }

    onAnimeLookupName(_reaction: (name: (string | undefined)) => any): IReactionDisposer {
        return reaction(
            () => this.anime.animeLookupName,
            name => _reaction(name)
        );
    }

    async setAnime(anime: IAnime | undefined): Promise<void> {
        return this.anime.setAnime(anime);
    }

    goToPrevScreen(): void {
        this.screens.goBack();
    }

    gotoScreen(screen: Screens): void {
        this.screens.push(screen);
    }

    currentScreen() {
        return this.screens.current;
    }
}

decorate(inject(TYPES.Animes) as ParameterDecorator, MainState, 0);
decorate(inject(TYPES.AnimeRates) as ParameterDecorator, MainState, 1);
decorate(inject(TYPES.AuthorizationApi) as ParameterDecorator, MainState, 2);
decorate(inject(TYPES.config.shikimoriHost) as ParameterDecorator, MainState, 3);
