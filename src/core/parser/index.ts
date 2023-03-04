import {AnimeGoParser} from './collection/animego';
import {IParser} from './types';
import {YummyanimeParser} from './collection/yummyanime';
import {AnimestarsParser} from './collection/animestars';
import {AnimebestParser} from './collection/animebest';
import {OnlineAnimediaParser} from './collection/online_animedia';
import {AnimevostParser} from './collection/animevost';
import {OnlineAnilibriaParser} from './collection/online_anilibria';
import {AkariAnimeParser} from './collection/akari-anime';
import {AnimeAnidubLifeParser} from './collection/anime_anidub_life';
import {AnilibriaParser} from './collection/anilibria'

export const parsers: IParser[] = [
    new AnimeGoParser(),
    new YummyanimeParser(),
    new AnimestarsParser(),
    new AnimebestParser(),
    new OnlineAnimediaParser(),
    new AnimevostParser(),
    new OnlineAnilibriaParser(),
    new AkariAnimeParser(),
    new AnimeAnidubLifeParser(),
    new AnilibriaParser()
];

export function getName(host: string, path: string, document: Document): null | string {
    for (const parser of parsers) {
        if (parser.checkUrl(host, path)) {
            return parser.parse(document);
        }
    }
    return null;
}
