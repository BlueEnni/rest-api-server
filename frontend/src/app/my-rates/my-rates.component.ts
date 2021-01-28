//for HTTP requests etc...
import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
//for getting the current routing object information
// for transmitting an validated loginform object
import * as cookies from 'js-cookie'

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

export interface RateWithCheck extends Rate{
  check: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', check: false},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', check: true},
];


@Component({
  selector: 'app-my-rates',
  templateUrl: './my-rates.component.html',
  styleUrls: ['./my-rates.component.css']
})

export class MyRatesComponent implements OnInit {
  displayedColumns: string[] = ['tarifName', 'plz'];
  dataSource: RateWithCheck[] = [];
  rates: Rate[] = [];


  constructor(
  ) {
  }

  ngOnInit(): void {
    this.dataSource = JSON.parse(cookies.get('myrates')) as RateWithCheck[];
  }

  checkAll(status: boolean): void {
    this.dataSource.map(item => item.check = status);
  }
}
