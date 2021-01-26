import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public isLinear = false;
  public registerForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(){

    this.registerForm = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      secondCtrl: ['', Validators.required],
      firstName: this._formBuilder.control(''),
      lastName: this._formBuilder.control(''),
      username: this._formBuilder.control(''),
      email: this._formBuilder.control(''),
      password: this._formBuilder.control(''),
    })
    this.registerForm.valueChanges.subscribe(() => {
      console.log(this.registerForm);
    })
  }

}
