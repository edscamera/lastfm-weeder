import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LastFMUserGetInfoResponse, LastFMUserGetRecentTracksResponse } from './models/lastfm';

@Injectable({
  providedIn: 'root'
})
export class LastfmService {
  constructor(private http: HttpClient) { }

  private readonly apiKey: string = `3f5b74fc6e2326464f912595f4b662e7`;
  private readonly baseUrl: string = `https://ws.audioscrobbler.com/2.0/?format=json&api_key`;
  public username: string = `edscamera`;

  private call<T>(methodOptions: LastfmApiOptions): Observable<T> {
    const options = {
      ...methodOptions,
      api_key: this.apiKey,
      user: this.username,
      format: `json`,
    };
    const params = new HttpParams({ fromObject: options as any });
    return this.http.get<T>(this.baseUrl, { params });
  }

  public getUserInfo(): Observable<LastFMUserGetInfoResponse> {
    return this.call<LastFMUserGetInfoResponse>({
      method: `user.getinfo`,
    });
  }

  public getRecentTracks(page?: number): Observable<LastFMUserGetRecentTracksResponse> {
    return this.call<LastFMUserGetRecentTracksResponse>({
      method: `user.getrecenttracks`,
      limit: `200`,
      page: page ?? 1,
    });
  }
}

interface LastfmApiOptions {
  method: string;
  [key: string]: string | number;
}
