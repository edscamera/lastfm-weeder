import { Component, OnInit } from '@angular/core';
import { LastfmService } from './lastfm.service';
import { LastFMUserGetInfoResponse } from './models/lastfm';
import { ButtonModule } from 'primeng/button';
import { BadScrobble } from './models/BadScrobble';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(public lastfmService: LastfmService) { }
  public user: LastFMUserGetInfoResponse | null = null;

  public ngOnInit(): void {
    this.lastfmService.getUserInfo().subscribe({
      next: user => this.user = user,
    });
  }

  public scan(): void {
    this.lastfmService.getRecentTracks().subscribe({
      next: response => {
        console.log(response);
        const badScrobbles: BadScrobble[] = response.recenttracks.track.map(track => ({
          album: track.album['#text'],
          albumHasMBID: Boolean(track.album.mbid),
          artist: track.artist['#text'],
          artistHasMBID: Boolean(track.artist.mbid),
          title: track.name,
          trackHasMBID: Boolean(track.mbid),
        })).filter(x => !x.album || !x.albumHasMBID || !x.artistHasMBID || !x.trackHasMBID);
        console.log(badScrobbles);
      },
    });
  }
}
