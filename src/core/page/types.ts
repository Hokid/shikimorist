export type PageLookupName = {
    type: 'name';
    value: string;
}

export type PageLookupAnime = {
    type: 'anime';
    value: { id: number };
}

export type PageLookupResult = PageLookupName | PageLookupAnime;
