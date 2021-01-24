import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundErrorComponent } from './not-found-error/not-found-error.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [{
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
  path: '**',
  component: NotFoundErrorComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
