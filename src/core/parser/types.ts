export interface IParser {
    checkUrl(host: string, path: string): boolean;

    parse(document: Document, host: string, path: string): string | null;
}
