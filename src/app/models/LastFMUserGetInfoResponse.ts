import { LastFMBooleanNumber } from "./LastFMBooleanNumber";

export interface LastFMUserGetInfoResponse {
    name: string;
    age: string;
    subscriber: LastFMBooleanNumber;
    realname: string;
    bootstrap: LastFMBooleanNumber;
    playcount: string;
    artist_count: string;
    playlists: string;
    track_count: string;
    album_count: string;
    image: Array<{
        '#text': string;
        size: string;
    }>;
    registered: {
        unixtime: string;
        '#text': number;
    };
    country: string;
    gender: string;
    url: string;
    type: string;
}
