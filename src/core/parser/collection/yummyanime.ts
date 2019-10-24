import {IParser} from '../types';

export class YummyanimeParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'yummyanime.club' && /^\/catalog\/item\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const titleName = document.querySelector('.anime-page > h1');
        const namesItems = document.querySelectorAll('.alt-names-list > li');
        const names = Array.from(namesItems).map(_ => _.innerHTML);
        const inLatin = names.filter(_ => !/а-яёА-ЯЁ/.test(_));

        return (
            inLatin.length
                ? inLatin[0]
                : names.length
                    ? names[0]
                    : titleName
                        ? titleName.innerHTML
                        : null
        );
    }
}
