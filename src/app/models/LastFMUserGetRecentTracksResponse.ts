import { LastFMBooleanNumber } from "./LastFMBooleanNumber";

export type LastFMUserGetRecentTracksResponse = Readonly<{
	recenttracks: {
		track: Array<LastFMTrack>;
		'@attr': {
			user: string;
			totalPages: string;
			page: string;
			perPage: string;
			total: string;
		};
	};
}>;

export interface LastFMTrack {
	artist: {
		mbid: string;
		'#text': string;
	};
	streamable: LastFMBooleanNumber;
	image: Array<{
		'#text': string;
		size: string;
	}>;
	mbid: string;
	album: {
		mbid: string;
		'#text': string;
	};
	name: string;
	url: string;
	date: {
		uts: string;
		'#text': string;
	};
	'@attr'?: {
		nowplaying: "true"
	};
};
