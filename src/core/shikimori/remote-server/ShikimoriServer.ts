import {Server} from '../../remote-server/Server';
import {ChanelFactory} from '../../messager/ChanelFactory';
import {ShikimoriHttpApi} from '../Shikimori';

export class ShikimoriServer extends Server {
    constructor(
        channelFactory: ChanelFactory,
        private shikimori: ShikimoriHttpApi
    ) {
        super(channelFactory.create('shikimori'));
    }

    protected async onInitialization(): Promise<void> {
        await this.shikimori.initialize();
    }
}
