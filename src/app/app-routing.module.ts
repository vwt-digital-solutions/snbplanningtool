import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';

import { HomeComponent } from './modules/home/home.component';
import { CarsComponent } from './modules/cars/cars.component';
import { WorkComponent } from './modules/work/work.component';

import { Role } from './models/role';

const routes: Routes = [
    {
      path: 'kaart',
      component: HomeComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'kaart/:trackerId',
      component: HomeComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'autos',
      component: CarsComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Editor, Role.Planner] }
    },
    {
      path: 'werk',
      component: WorkComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Editor, Role.Planner] }
    },
    {
      path: 'map',
      redirectTo: 'kaart'
    },
    {
      path: 'cars',
      redirectTo: 'autos'
    },
    {
      path: 'work',
      redirectTo: 'werk'
    },
    {
      path: 'auth/:authBody',
      component: AuthComponent,
    },
    {
      path: '**',
      redirectTo: 'kaart'
    }
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
