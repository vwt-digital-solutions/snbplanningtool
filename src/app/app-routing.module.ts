import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './modules/home/home.component';
import { CarsComponent } from './modules/cars/cars.component';
import { WorkComponent } from './modules/work/work.component';

const routes: Routes = [
    { path: 'map', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'cars', component: CarsComponent, canActivate: [AuthGuard] },
    { path: 'work', component: WorkComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'map' }
  ];

@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule { }
