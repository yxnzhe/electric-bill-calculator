import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'electric-bill-calculator';

  contentVisible = false;

  showContent() {
    this.contentVisible = true;
  }
}
