import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyRatesComponent } from './my-rates/my-rates.component';
import { NotFoundErrorComponent } from './not-found-error/not-found-error.component';
import { RatesComponent } from './rates/rates.component';
import { RegistrationComponent } from './registration/registration.component';
import { SearchComponent } from './search/search.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [ {
  path: '',
  pathMatch: 'full',
  component: HomeComponent
},
{
  path: 'test',
  component: TestComponent
},
{
  path: 'test/:id',
  component: HomeComponent
},
{
  path: 'registration',
  component: RegistrationComponent
},
{
  path: 'search',
  component: SearchComponent
},
{
  path: 'myRates',
  component: MyRatesComponent
},
{
  path: 'rates',
  component: RatesComponent
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: '**',
  component: NotFoundErrorComponent
} ];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
