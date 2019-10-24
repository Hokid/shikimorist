import {IAnime} from '../api/animes';

export function getAnimeName(anime: IAnime) {
    let name = anime.russian || '';

    if (name) {
        name += ' / ' + anime.name;
    } else {
        name = anime.name;
    }

    return name;
}
