import { Component, OnInit } from '@angular/core';
import * as cookies from 'js-cookie';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    this._snackBar.open(`Logout erfolgreich!`, `close`, { duration: 4000 });
  }


  constructor(
    private _snackBar: MatSnackBar
  ) { }
}
