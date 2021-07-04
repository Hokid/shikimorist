import 'reflect-metadata';
import {AnimeContextServer} from './core/anime-context/AnimeContextServer';
import {ChromeRuntimeBus} from './core/messager/bus-library/chrome-runtime/chrome-runtime-bus';
import {ChanelFactory} from './core/messager/ChanelFactory';

const server = new AnimeContextServer(
    new ChanelFactory(
        new ChromeRuntimeBus()
    )
);

server.initialize()
    .catch(error => console.error(error));
