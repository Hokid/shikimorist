import {Tab} from './data/tab';
import {ChanelMessageConsumer} from '../messager/consumer';
import {MemoryBus} from '../messager/bus-library/memory/memory-bus';
import {Message} from '../messager/message';
import {Handler} from '../messager/bus';
import {Chanel} from '../messager/Chanel';
import {TabMessages, TabRemovedMessage, TabUpdatedMessage} from './channel';
import {TabCreationParams} from './data/create-params';

export class Tabs implements ChanelMessageConsumer {
    private channel = new Chanel('tabs', new MemoryBus());
    private chromeTabsApi = chrome.tabs;

    constructor() {
        this.chromeTabsApi.onUpdated.addListener(async (tabId, info) => {
            const message = new TabUpdatedMessage({
                ...info,
                id: tabId
            });
            await this.channel.send(message);
        });

        this.chromeTabsApi.onRemoved.addListener(async (tabId, info) => {
            const message = new TabRemovedMessage({
                id: tabId
            });
            await this.channel.send(message);
        });
    }

    async getById(tabId: number): Promise<Tab | void> {
        return new Promise((resolve, reject) => {
            this.chromeTabsApi.get(tabId, tab => {
                resolve({
                    id: tab.id!,
                    active: tab.active
                });
            });
        });
    }

    async create(params: TabCreationParams): Promise<Tab> {
        return new Promise((resolve, reject) => {
            this.chromeTabsApi.create(params, tab => {
                resolve({
                    id: tab.id!,
                    active: tab.active
                });
            })
        });
    }

    async activate(tabId: number): Promise<Tab> {
        return new Promise((resolve, reject) => {
            this.chromeTabsApi.update(tabId, {active: true}, tab => {
                if (!tab) {
                    return reject(new Error('No tab'));
                }
                resolve({
                    id: tab.id!,
                    active: tab.active
                });
            });
        });
    }

    async remove(tabId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.chromeTabsApi.remove(tabId, resolve);
        });
    }

    on<M extends TabMessages = TabMessages>(
        name: M extends Message<infer N> ? N : string,
        handler: M extends Message<any, infer D, infer R>
            ? Handler<D, R>
            : Handler<unknown, unknown>
    ): void;

    on(name: string, handler: Handler): void {
        return this.channel.on(name, handler);
    }

    off<M extends TabMessages = TabMessages>(
        name: M extends Message<infer N> ? N : string,
        handler: M extends Message<any, infer D, infer R>
            ? Handler<D, R>
            : Handler<unknown, unknown>
    ): boolean;

    off(name: string, handler: Handler): boolean {
        return this.channel.off(name, handler);
    }
}
