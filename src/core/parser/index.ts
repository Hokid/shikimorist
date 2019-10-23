import {AnimeGoParser} from './collection/animego';
import {IParser} from './types';

const parsers: IParser[] = [
    new AnimeGoParser()
];

export function getName(host: string, path: string, document: Document): null | string {
    for (const parser of parsers) {
        if (parser.checkUrl(host, path)) {
            return parser.parse(document);
        }
    }
    return null;
}
