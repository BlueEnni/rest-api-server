import { Component, OnInit } from '@angular/core';
//for HTTP requests etc...
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//for getting the current routing object information
import { ActivatedRoute } from '@angular/router';
//for transmitting an validated loginform object
import { FormBuilder, FormGroup } from '@angular/forms';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public loginForm: FormGroup;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private http: HttpClient
    ){}

  ngOnInit(){
    console.log(this.route.snapshot);
    //_ für private Variablen
    this.loginForm = this._formBuilder.group({
      username: this._formBuilder.control('beschte'),
      password: this._formBuilder.control('1234'),
    })
    this.loginForm.valueChanges.subscribe(() => {
      console.log(this.loginForm);
    })
  }
 /*
  getAll(){
    this.httpClient.get('http://localhost:3000/').subscribe( users => {
    // users ist die antwort vom server
  })
  }*/
  
  userLogin(){
    const {username: username2 = '', password} = this.loginForm.value;
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

        console.log(res);
      
    }, (err) => {
      // browser alert - popupfenster
      this.error = err.error;
      alert(err.error);
    })

  }
}
