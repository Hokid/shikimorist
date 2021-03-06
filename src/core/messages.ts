import {IAnime} from './api/animes';

export type GotNameMessage = {
    event: 'got_name',
    data: string
}

export type ClearMessage = {
    event: 'clear'
}

export type SignInMessage = {
    event: 'signIn'
}

export type SignOutMessage = {
    event: 'signOut'
}

export type RefreshToken = {
    event: 'refreshToken'
}

export type RequestPageData = {
    event: 'request-page-data'
}

export type CallAuthMethod = {
    event: 'auth-method',
    data: string;
}

export type SetAnime = {
    event: 'set-anime',
    value: {id: number};
}

export type BgAuthUpdateStatus = {
    event: 'background-auth-update-status',
    data: boolean;
}

export type Message =
    GotNameMessage
    | ClearMessage
    | SignInMessage
    | SignOutMessage
    | RefreshToken
    | RequestPageData
    | CallAuthMethod
    | BgAuthUpdateStatus
    | SetAnime;
