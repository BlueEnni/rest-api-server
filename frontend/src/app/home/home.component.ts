//for HTTP requests etc...
import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//for getting the current routing object information
import { ActivatedRoute } from '@angular/router';
//for transmitting an validated loginform object
import { FormBuilder, FormGroup } from '@angular/forms';
import * as cookies from 'js-cookie'
import * as moment from 'moment';

export interface Rate {
  id: number;
  tarifName: string;
  plz: string;
  fixkosten: number;
  variableKosten: number;
}

export interface RateWithCheck extends Rate {
  check: boolean;
}

interface RatesData extends Rate {
  checked: boolean;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [ 'tarifName', 'plz' ];
  dataSource: RateWithCheck[] = [];
  rates: Rate[] = [];

  selecedRates: { [ key: number ]: Rate } = {};

  constructor() {
    const myrates = cookies.get(`myrates`);
    if (myrates) {
      const prevSelected = JSON.parse(myrates) as RatesData[];

      console.log(prevSelected)

      if (prevSelected) {
        prevSelected.forEach(rate => {
          this.selecedRates[ rate.id ] = rate;
        });
      }
    }
  }

  ngOnInit() {
    const myrates = cookies.get('myrates');
    if (myrates) {
      this.dataSource = JSON.parse(myrates) as RateWithCheck[];
    }
  }
}
