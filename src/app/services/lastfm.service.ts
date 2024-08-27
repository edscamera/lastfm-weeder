import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LastFMUserGetInfoResponse } from '../models/LastFMUserGetInfoResponse';
import { LastFMUserGetRecentTracksResponse } from '../models/LastFMUserGetRecentTracksResponse';

@Injectable({
  providedIn: 'root'
})
export class LastfmService {
  constructor(private http: HttpClient) {
    console.warn("Please make a new last.fm API key!");
  }

  private apiKey = "364d88bbf865b2046c869bd79583087a";

  public getUserInfo(username: string): Observable<LastFMUserGetInfoResponse> {
    const params = {
      user: username,
      method: "user.getinfo",
      api_key: this.apiKey,
    };
    return this.http.get("https://ws.audioscrobbler.com/2.0/?format=json", { params }).pipe(
      map((response: any) => response.user)
    );
  }

  public getRecentTracks(username: string, page?: number): Observable<LastFMUserGetRecentTracksResponse> {
    const params = {
      user: username,
      method: "user.getrecenttracks",
      api_key: this.apiKey,
      limit: 200,
      page: page ?? 1,
    };
    return this.http.get<LastFMUserGetRecentTracksResponse>("https://ws.audioscrobbler.com/2.0/?format=json", { params });
  }
}
