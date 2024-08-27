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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastModule, RouterOutlet, FloatLabelModule, FormsModule, ButtonModule, InputTextModule, ProgressBarModule],
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
            let tracks: LastFMTrack[] = [];
            data.forEach(result => {
              tracks = tracks.concat(result.recenttracks.track);
            });
            console.log(tracks);
            this.progress = null;
          },
        }).add(() => this.loading--);
      },
      error: err => this.toast.error(`${err.error.message}!`),
    });
  }
}
