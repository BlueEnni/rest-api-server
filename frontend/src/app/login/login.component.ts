import { Component, OnInit } from '@angular/core';
//for HTTP requests etc...
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//for getting the current routing object information
import { ActivatedRoute } from '@angular/router';
//for transmitting an validated loginform object
import { FormBuilder, FormGroup } from '@angular/forms';
import * as cookies from 'js-cookie';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.route.snapshot);
    //_ für private Variablen
    this.loginForm = this._formBuilder.group({
      username: this._formBuilder.control(''),
      password: this._formBuilder.control(''),
    })
    this.loginForm.valueChanges.subscribe(() => {
    })
  }
  /*
   getAll(){
     this.httpClient.get('http://localhost:3000/').subscribe( users => {
     // users ist die antwort vom server
   })
   }*/

  userLogin() {
    const { username: username2 = '', password } = this.loginForm.value;
    // kürzt ab :
    // username2 = this.loginForm.value.username
    // password = this.loginForm.value.password
    // const [test1,test2] = [1,2,3];
    // console.log({username2, password, test1, test2});
    const body = {
      username: username2,
      password
    }
    // body.username = username2;
    this.http.post('http://localhost:3000/login', body).subscribe(res => {
      // res ist die server response
      // die and .subscribe funktion übergebende funktion läuft wenn der resquest beendet ist
      cookies.set('token', res as string);
      this._snackBar.open(`Login erfolgreich!`, `close`, { duration: 4000 });
      console.log(res);

    }, (err) => {
      // browser alert - popupfenster
      this.error = err.error;
      alert(err.error);
      this._snackBar.open(`Login fehlgeschlagen!`, `close`, { duration: 4000 });
    })
  }

}
