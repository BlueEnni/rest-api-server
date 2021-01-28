import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Rate } from '../my-rates/my-rates.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as cookies from 'js-cookie';
import * as moment from 'moment';

interface RatesData extends Rate {
  checked: boolean;
}

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: [ './rates.component.css' ]
})
export class RatesComponent implements OnInit {

  displayedColumns: string[] = [ 'tarifName', 'plz', 'fixkosten', 'variableKosten', `controlCol` ];
  dataSource: MatTableDataSource<RatesData>;

  selecedRates: { [ key: number ]: Rate } = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private http: HttpClient
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
    console.log(this.selecedRates);

    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.http.get<Rate[]>(`${environment.API_LOCATION}/rates`)
      .subscribe(result => {
        this.dataSource.data = result.map((rate): RatesData => {
          const rateData: Partial<RatesData> = rate;
          console.log(Object.keys(this.selecedRates).includes(rate.id.toString()))
          rateData.checked = Object.keys(this.selecedRates).includes(rate.id.toString());
          return rateData as RatesData;
        });
        this.dataSource.paginator = this.paginator;
      }, error => console.log(error));
  }

  onRateSelected(element: Rate, set: boolean): void {
    if (set) {
      this.selecedRates[ element.id ] = element;
    } else {
      delete this.selecedRates[ element.id ];
    }

    const expiresAt = moment().add('day', 7).toDate();
    console.log(expiresAt);
    cookies.set(`myrates`, JSON.stringify(Object.values(this.selecedRates)), { expires: expiresAt });

  }
}
