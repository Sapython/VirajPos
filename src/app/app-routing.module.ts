import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./loading/loading.module').then((m) => m.LoadingModule),
      data:{
        animation:'isLeft'
      }
  },
  {
    path: 'biller',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./biller/biller.module').then((m) => m.BillerModule),
      data:{
        animation:'isRight'
      }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
