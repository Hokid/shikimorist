import {IParser} from '../types';
import {forEach} from "lodash";

export class AnilibriaParser implements IParser {
    checkUrl(host: string, path: string): boolean {
        return host === 'anilibria.tv' && /^\/release\/.+/.test(path);
    }

    parse(document: Document): string | null {
        const titleNameElement = document.querySelector('.release-title');
        if (!titleNameElement) {
            return null;
        }
        let separator = ["/", "<br>"];
        let finedSeparator;
        forEach(separator, function (separatorValue) {
            if (titleNameElement.innerHTML.includes(separatorValue)) {
                finedSeparator = separatorValue;
            }
        });
        if (finedSeparator) {
            return titleNameElement.innerHTML.split(finedSeparator)[1].trim();
        }
        return null;
    }
}
