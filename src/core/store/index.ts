import {injectable} from 'inversify';
import { Sentry } from '../../sentry';

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

    async setAnimeForURL(url: string, anime: {id: number} | undefined) {
        if (!anime) {
            return await Promise.all([
                chrome.storage.sync.remove([url]),
                chrome.storage.local.remove([url]),
            ]);
        }
        try {
            console.debug('writing anime for url to sync storage. url=%s, anime=%j', url, anime);
            await chrome.storage.sync.set({
                [url]: anime
            });
        } catch (err) {
            console.error('set anime for url error(sync): %O', err);
            Sentry.captureException(err, {
                contexts: {
                    storage: {
                        class: 'sync'
                    },
                }
            });
            try {
                console.debug('writing anime for url to local storage. url=%s, anime=%j', url, anime);
                await chrome.storage.local.set({
                    [url]: anime
                });
            } catch (err) {
                console.error('set anime for url error(local): %O', err);
                Sentry.captureException(err, {
                    contexts: {
                        storage: {
                            class: 'local'
                        },
                    }
                });
            }
        }
    }

    async getAnimeForURL(url: string): Promise<{id: number} | undefined | void> {
        const filter = async <R extends Record<string, {id: number}>>(result: Promise<R>): Promise<{id: number} | void> => {
            if (Object.keys(await result).length !== 0) {
                return (await result)[url];
            }
        };
        return await Promise.all([
            filter(chrome.storage.sync.get([url])),
            filter(chrome.storage.local.get([url])),
        ]).then(responses => responses.find(reponse => reponse));
    }
}
