export type AnimeDescriptionFull = {
    id: number;
}

export type AnimeDescriptionRequestName = {
    type: 'name';
    value: string;
}

export type AnimeDescriptionRequestFull = {
    type: 'full';
    value: AnimeDescriptionFull;
}

export type AnimeDescriptionRequestResult = AnimeDescriptionRequestName | AnimeDescriptionRequestFull | null;
