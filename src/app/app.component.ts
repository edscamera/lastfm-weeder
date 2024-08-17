import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { LastfmService } from './services/lastfm.service';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastModule, RouterOutlet, FloatLabelModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private api: LastfmService,
    private toast: ToastService,
  ) { }

  public username: string = "";
  public weed(): void {
    if (this.username.replace(/\s/g, "").length === 0)
      return this.toast.warn("Please enter a username!");

    this.api.getUserInfo(this.username).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => this.toast.error(`${err.error.message}!`),
    });
  }
}
