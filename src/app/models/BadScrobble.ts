export interface BadScrobble {
    artist: string;
    album: string;
    title: string;

    albumHasMBID: boolean;
    artistHasMBID: boolean;
    trackHasMBID: boolean;
}
