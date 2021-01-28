import { Component, OnInit } from '@angular/core';
import * as cookies from 'js-cookie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  title = 'frontend';
  id = 5;
  logout(): void {
    cookies.remove(`myrates`);
    cookies.remove(`token`);
  }
}
