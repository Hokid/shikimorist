export interface Anime {
    id: number;
    name: string;
    score: number;
    russian: string | null;
    episodes: number;
    episodes_aired: number;
    url: string;
    image: {
        original: string;
        preview: string;
    };
}
