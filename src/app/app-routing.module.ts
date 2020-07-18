import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule),
      canActivate: [AutoLoginGuard]
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(m => m.RegisterPageModule),
      canActivate: [AutoLoginGuard]
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  { path: 'patient/:id', loadChildren: './pages/patient/patient.module#PatientPageModule' },
  { path: 'history', loadChildren: './pages/history/history.module#HistoryPageModule' },
  { path: 'add-patient', loadChildren: './pages/add-patient/add-patient.module#AddPatientPageModule' },
  { path: 'array-adder', loadChildren: './pages/array-adder/array-adder.module#ArrayAdderPageModule' },
  { path: 'edit-patient', loadChildren: './pages/edit-patient/edit-patient.module#EditPatientPageModule' },
  { path: 'logs', loadChildren: './pages/logs/logs.module#LogsPageModule' },
  { path: 'user/:id', loadChildren: './pages/user/user.module#UserPageModule' },
  { path: 'shifts', loadChildren: './pages/shifts/shifts.module#ShiftsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
