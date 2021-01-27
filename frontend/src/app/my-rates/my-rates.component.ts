//for HTTP requests etc...
import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//for getting the current routing object information
import { ActivatedRoute } from '@angular/router';
//for transmitting an validated loginform object
import { FormBuilder, FormGroup } from '@angular/forms';
import { element } from 'protractor';
import { EMLINK } from 'constants';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
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
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','check'];
  dataSource = ELEMENT_DATA;


  constructor() { }

  ngOnInit(): void {
  }

  checkAll(status: boolean){
    this.dataSource.map(element => {
      element.check = status;
      return element;
    })
  }

}
