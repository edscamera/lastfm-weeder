import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LastfmService } from './services/lastfm.service';
import { ToastService } from './services/toast.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LastFMUserGetInfoResponse } from './models/LastFMUserGetInfoResponse';
import { forkJoin, tap } from 'rxjs';
import { LastFMTrack } from './models/LastFMUserGetRecentTracksResponse';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { SplitterModule } from 'primeng/splitter';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastModule, RouterOutlet, FloatLabelModule, FormsModule, ButtonModule, InputTextModule, ProgressBarModule, TableModule, SplitterModule, CheckboxModule, TooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private api: LastfmService,
    private toast: ToastService,
  ) { }

  public username: string = "";
  public loading: number = 0;

  public progress: null | number = null;

  public tracks: LastFMTrack[] | null = null;
  public filteredTracks: LastFMTrack[] = [];

  public groupScrobbles: boolean = true;

  public weed(): void {
    if (this.loading > 0) return;
    this.loading++;

    if (this.username.replace(/\s/g, "").length === 0)
      return this.toast.warn("Please enter a username!");

    this.api.getUserInfo(this.username).subscribe({
      next: data => this.fetchTracks(data),
      error: err => this.toast.error(`${err.error.message}!`),
    }).add(() => this.loading--);
  }

  public fetchTracks(userInfo: LastFMUserGetInfoResponse): void {
    this.loading++;
    let requests = 0;
    this.progress = 0;
    this.api.getRecentTracks(userInfo.name, 1).subscribe({
      next: data => {
        const totalPages = parseInt(data.recenttracks['@attr'].totalPages);
        
        const observables = [];
        for (let i = 1; i <= totalPages; i++)
          observables.push(this.api.getRecentTracks(userInfo.name, i).pipe(
            tap(() => {
              requests++;
              this.progress = Math.round((requests / totalPages) * 100);
            }),
          ));
      
        forkJoin(observables).subscribe({
          next: data => {
            this.progress = null;
            this.tracks = data.map(result => result.recenttracks.track).flat();
            this.refilterTracks();
          },
        }).add(() => this.loading--);
      },
      error: err => this.toast.error(`${err.error.message}!`),
    });
  }

  public refilterTracks(): void {
    if (!this.tracks) return;
    this.filteredTracks = [...this.tracks];

    if (this.groupScrobbles) {
      const map: Record<string, LastFMTrack> = {};
      this.filteredTracks.forEach(track => {
        map[track.url] = track;
      });
      this.filteredTracks = Object.values(map);
    }
  }

  public getLibraryTrackLink(trackUrl: string): string {
    const url = new URL(trackUrl);
    return `${url.origin}/user/${this.username}/library${url.pathname}`;
  }
  public getLibraryAlbumLink(trackUrl: string): string {
    const libraryTrackURL = new URL(this.getLibraryTrackLink(trackUrl));
    return libraryTrackURL.origin + libraryTrackURL.pathname.split("/").slice(0, -2).join("/");
  }
}
