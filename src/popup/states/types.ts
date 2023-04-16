import {IAnime} from '../../core/api/animes';
import {IReactionDisposer} from 'mobx';

export interface IScreenState {
    gotoScreen(screen: Screens): void;
    goToPrevScreen(): void;
    currentScreen(): Screens | void;
}

export interface IErrorState {
    getScopedErrorCatcher(): (error: Error, repeater: () => any) => void;
    catchError(error: Error, repeater: () => any, scope: Screens | void): void;
}

export interface IAuthorizationState {
    isAuthorized(): boolean;
    onAuthorization(reaction: (status: boolean) => any): IReactionDisposer;
}

export interface ILoaderState {
    startLoader(): () => void;
    onLoading(reaction: (status: boolean) => any): IReactionDisposer;
}

export interface IAnimeState {
    onAnimeLookupName(reaction: (name: string | undefined) => any): IReactionDisposer;
    onAnime(reaction: (anime: IAnime | undefined) => any): IReactionDisposer;
    setAnime(anime: IAnime | undefined): Promise<void>;
}

export enum Screens {
    VOID,
    SIGN_IN,
    EMPTY,
    ERROR,
    ADD_TO_LIST,
    RATE_CONTROL,
    MENU,
    SEARCHING,
    LOADER,
    SUPPORTED_RESOURCES
}
