import {Message} from '../messager/message';

export interface TabRemovedMessageData {
    id: number;
}

export class TabRemovedMessage extends Message<'removed', TabRemovedMessageData, void> {
    constructor(data: TabRemovedMessageData) {
        super('removed', data);
    }
}

export interface TabUpdatedMessageData {
    id: number;
    // if url changed
    url?: string;
}

export class TabUpdatedMessage extends Message<'updated', TabUpdatedMessageData, void> {
    constructor(data: TabUpdatedMessageData) {
        super('updated', data);
    }
}

export type TabMessages = TabRemovedMessage | TabUpdatedMessage;
