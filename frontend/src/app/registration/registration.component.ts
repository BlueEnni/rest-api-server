import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public isLinear = false;
  public registerForm: FormGroup;
  public isSubmitting = false;

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  ngOnInit(): void {

    this.registerForm = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      secondCtrl: ['', Validators.required],
      firstName: this._formBuilder.control(''),
      lastName: this._formBuilder.control(''),
      username: this._formBuilder.control(''),
      email: this._formBuilder.control(''),
      password: this._formBuilder.control(''),
    });
    this.registerForm.valueChanges.subscribe(() => {
      console.log(this.registerForm);
    });
  }

  onSubmitRegistration(): void {
    this.isSubmitting = true;
    const {firstName, lastName, username, email, password} = this.registerForm.value;
    const body = {
      firstName,
      lastName,
      username,
      email,
      password
    };

    this.http.post(`${environment.API_LOCATION}/signup`, body).subscribe(() => {
      console.log(`success`);
      this._snackBar.open(`Registrierung erfolgreich!`, `close`, {duration: 2000});
      this.router.navigate([`/login`]).catch();
    }, error => {
      console.log(error);
      this.isSubmitting = false;
    });
  }
}
