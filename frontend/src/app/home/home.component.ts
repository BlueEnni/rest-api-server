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
    this.loginForm = this._formBuilder.group({
      username: this._formBuilder.control('beschte'),
      password: this._formBuilder.control('1234'),
    })
    this.loginForm.valueChanges.subscribe(() => {
      console.log(this.loginForm);
    })
  }
  
  userLogin(){
    const {username: username2 = '', password} = this.loginForm.value;
    const body = {
      username: username2,
      password
    }

    this.http.post('http://localhost:3000/login', body).subscribe(res => {
        console.log(res);
      
    }, (err) => {
      this.error = err.error;
      alert(err.error);
    })

  }
}
