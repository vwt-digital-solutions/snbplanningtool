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
      path: 'map',
      component: HomeComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'map/:trackerId',
      component: HomeComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'cars',
      component: CarsComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Editor, Role.Planner] }
    },
    {
      path: 'work',
      component: WorkComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Editor, Role.Planner] }
    },
    {
      path: 'auth/:authBody',
      component: AuthComponent,
    },
    {
      path: '**',
      redirectTo: 'map'
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
