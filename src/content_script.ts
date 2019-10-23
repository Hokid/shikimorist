import {getName} from './core/parser';
import {ClearMessage, GotNameMessage, Message} from './core/messages';

chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.event === 'pingPage') {
        console.log('pong');
        update();
    }
});

window.addEventListener('load', (event) => {
    update();
});

function update() {
    const name = getName(
        window.location.host,
        window.location.pathname,
        window.document
    );

    chrome.runtime.sendMessage({
        event: 'clear'
    } as ClearMessage);

    if (name) {
        chrome.runtime.sendMessage({
            event: 'got_name',
            data: name
        } as GotNameMessage);
    }
}
