import {injectable} from 'inversify';
import {IAnime} from '../api/animes';

@injectable()
export class Store {
    async setWatchAuth(flag: boolean) {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.local.set({
                content_script_watch_auth: flag
            }, resolve);
        })
    }

    async getWatchAuth(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            chrome.storage.local.get(
                ['content_script_watch_auth'],
                (result) => resolve(!!result.content_script_watch_auth)
            );
        })
    }

    async setAuthData(data: any) {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.local.set({
                auth_data: data
            }, resolve);
        })
    }

    async getAuthData(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            chrome.storage.local.get(
                ['auth_data'],
                (result) => resolve(result.auth_data)
            );
        })
    }

    async setUser(data: any) {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.local.set({
                user: data
            }, resolve);
        })
    }

    async getUser(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            chrome.storage.local.get(
                ['user'],
                (result) => resolve(result.user)
            );
        })
    }

    async setAnimeForURL(url: string, anime: IAnime | undefined) {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.set({
                [url]: anime
            }, resolve);
        });
    }

    async getAnimeForURL(url: string): Promise<IAnime | undefined | void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.get(url, (result) => resolve(result[url]));
        });
    }
}
