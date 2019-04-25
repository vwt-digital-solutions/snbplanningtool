import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './modules/home/home.component';
import { InfoComponent } from './modules/info/info.component';

const routes: Routes = [
    { path: 'map', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'info', component: InfoComponent, canActivate: [AuthGuard] },
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
