import {Storage} from '../storage';

export class ChromeLocalStorage extends Storage {
    get<V>(key: string): Promise<V> {
        return new Promise((resolve, reject) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }
           chrome.storage.local.get(this.buildKey(key), result => resolve(result[key]))
        });
    }

    set<V>(key: string, value: V): Promise<void> {
        return new Promise((resolve, reject) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }
            chrome.storage.local.set({[this.buildKey(key)]: value}, () => resolve())
        });
    }

    remove(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }
            chrome.storage.local.remove(this.buildKey(key), () => resolve())
        });
    }
}
