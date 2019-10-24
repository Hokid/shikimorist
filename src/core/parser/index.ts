import {AnimeGoParser} from './collection/animego';
import {IParser} from './types';
import {YummyanimeParser} from './collection/yummyanime';
import {AnimestarsParser} from './collection/animestars';
import {AnimebestParser} from './collection/animebest';
import {OnlineAnimediaParser} from './collection/online_animedia';

export const parsers: IParser[] = [
    new AnimeGoParser(),
    new YummyanimeParser(),
    new AnimestarsParser(),
    new AnimebestParser(),
    new OnlineAnimediaParser(),
];

export function getName(host: string, path: string, document: Document): null | string {
    for (const parser of parsers) {
        if (parser.checkUrl(host, path)) {
            return parser.parse(document);
        }
    }
    return null;
}
