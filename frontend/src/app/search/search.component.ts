//for HTTP requests etc...
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//for getting the current routing object information
import { ActivatedRoute, Router } from '@angular/router';
//for transmitting an validated loginform object
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export type searchInput = { plz: number, mnt: number };

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.css' ]
})
export class SearchComponent implements OnInit {
  public searchForm: FormGroup;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    console.log(this.route.snapshot);
    //_ für private Variablen
    this.searchForm = this._formBuilder.group({
      plz: new FormControl(``),
      mnt: new FormControl(``)
    });
    this.searchForm.valueChanges.subscribe(() => {
      console.log(this.searchForm);
    });
  }

  onSearch(): void {
    const { plz, mnt } = this.searchForm.value as searchInput;

    const queryParams: Partial<searchInput> = {};

    if (plz) {
      queryParams.plz = plz;
    }

    if (mnt) {
      queryParams.mnt = mnt;
    }

    this.router.navigate([ '/rates' ], { queryParamsHandling: 'merge', queryParams })
      .catch(err => console.log(err));
  }
}
