import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  contentVisible = false;

  redirect() {
    window.location.href = '/electric-bill-calculator/#/calculator';
  }
}
