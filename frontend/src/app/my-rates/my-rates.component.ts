//for HTTP requests etc...
import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
//for getting the current routing object information
// for transmitting an validated loginform object
import * as cookies from 'js-cookie'
import * as moment from 'moment';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  check: boolean;
}

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
  selector: 'app-my-rates',
  templateUrl: './my-rates.component.html',
  styleUrls: [ './my-rates.component.css' ]
})

export class MyRatesComponent implements OnInit {
  displayedColumns: string[] = [ 'tarifName', 'plz', 'check' ];
  dataSource: RateWithCheck[] = [];
  rates: Rate[] = [];

  selecedRates: { [ key: number ]: Rate } = {};

  constructor(
  ) {
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

  ngOnInit(): void {
    const myrates = cookies.get('myrates');
    if (myrates) {
      this.dataSource = JSON.parse(myrates) as RateWithCheck[];
    }
  }

  checkAll(status: boolean): void {
    this.dataSource.map(item => item.check = status);
  }

  onRateSelected(element: Rate, set: boolean): void {
    if (set) {
      delete this.selecedRates[ element.id ];
    }
    const expiresAt = moment().add('day', 7).toDate();
    cookies.set(`myrates`, JSON.stringify(Object.values(this.selecedRates)), { expires: expiresAt });
    this.dataSource = Object.values(this.selecedRates) as RateWithCheck[];
  }
  onRateSelectedDeleteAll(): void {
    cookies.remove(`myrates`);
    this.dataSource = [];
  }
}
