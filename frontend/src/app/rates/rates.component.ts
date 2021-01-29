import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Rate } from '../my-rates/my-rates.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as cookies from 'js-cookie';
import * as moment from 'moment';
import { ActivatedRoute, Router } from "@angular/router";
import { searchInput } from "../search/search.component";

interface RatesData extends Rate {
  checked: boolean;
  gsmtPrice?: number;
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
  plz: number;
  private mnt: number;
  private allRates: RatesData[] = [];


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.loadSearchValues();
    const myrates = cookies.get(`myrates`);
    if (myrates) {
      const prevSelected = JSON.parse(myrates) as RatesData[];

      if (prevSelected) {
        prevSelected.forEach(rate => {
          this.selecedRates[ rate.id ] = rate;
        });
      }
    }

  }

  ngOnInit(): void {
    this.http.get<Rate[]>(`${environment.API_LOCATION}/rates`)
      .subscribe(result => {

        this.allRates = this.dataSource.data = result.map((rate): RatesData => {
          const rateData: Partial<RatesData> = rate;
          rateData.checked = Object.keys(this.selecedRates).includes(rate.id.toString());
          return rateData as RatesData;
        });

        this.updateData();

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

  updateData(): void {
    this.dataSource.data = this.allRates.filter(rate => {
      return (
        this.plz
          ? this.plz && this.plz.toString() === rate.plz
          : true
      );
    }).map(rate => {
      if (this.mnt) {
        rate.gsmtPrice = rate.fixkosten + rate.variableKosten * this.mnt;
      }
      return rate;
    }).sort((a, b) => {
      if (a.gsmtPrice && b.gsmtPrice) {
        return (a.gsmtPrice > b.gsmtPrice)
          ? 1
          : -1;
      }
      return 1;
    });
  }

  loadSearchValues(): void {
    this.route.queryParams
      .subscribe((params) => {
        const { mnt, plz } = params as searchInput;
        this.mnt = Number(mnt) || undefined;
        this.plz = Number(plz) || undefined;

        this.setDisplayGsmtPrice(!!this.mnt);

        this.updateData();
      });
  }

  setDisplayGsmtPrice(status: boolean): void {
    if (status && this.displayedColumns.includes(`mnt`)) {
      return;
    } else if (status) {
      this.displayedColumns.push(`mnt`);
    }
    else if (!status) {
      this.displayedColumns.filter(col => {
        return col !== 'mnt';
      });
    }
  }

  onRemovePlz(): void {
    this.router.navigate([ `.` ], {
      relativeTo: this.route,
      queryParamsHandling: null,
      queryParams: { mnt: this.mnt }
    }).catch(err => console.log(err));
  }
}
