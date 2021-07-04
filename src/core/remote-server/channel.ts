import {Message} from '../messager/message';
import {ServerStatus} from './statuses';

export class ServerStatusRequestMessage extends Message<'server-status-request', void, ServerStatus> {
    constructor() {
        super('server-status-request');
    }
}

export class ServerChangeStatusMessage extends Message<'server-change-status', ServerStatus, void> {
    constructor(status: ServerStatus) {
        super('server-change-status', status);
    }
}
