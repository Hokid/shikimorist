export interface IParser {
    checkUrl(host: string, path: string): boolean;

    parse(document: Document): string | null;
}
