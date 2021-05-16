import {Chanel} from '../messager/Chanel';
import {ClientStatus} from './statuses';
import {ServerStatusRequestMessage} from './channel';
import {Message} from '../messager/message';

export type InferResponse<C> = C extends Message<any, any, infer R> ? R : unknown;

export abstract class Client {
    protected constructor(protected channel: Chanel) {
    }

    private _clientStatus: ClientStatus = 'wait';

    public get clientStatus(): ClientStatus {
        return this._clientStatus;
    }

    async connect(): Promise<void> {
        if (this._clientStatus === 'connected') {
            return;
        }

        this._clientStatus = 'connecting';

        try {
            const message = new ServerStatusRequestMessage();
            const serverStatus = await this.channel.send(message, true);
            if (serverStatus === 'error') {
                throw new Error('Server initialization error');
            } else if (serverStatus === 'initialized') {
                this._clientStatus = 'connected';
                await this.onConnect();
            } else {
                return this.connect();
            }
        } catch (error) {
            this._clientStatus = 'connection-error';
            throw error;
        }
    }

    protected async sendCommand<C extends Message = Message>(command: C): Promise<InferResponse<C>> {
        if (this.clientStatus !== 'connected') {
            throw new Error('Client is not connected to server');
        }
        return this.channel.send<Message>(command, true);
    }

    protected async onConnect(): Promise<void> {
    };
}
