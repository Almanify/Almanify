import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'testing',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: '',
    redirectTo: 'login/login',
    pathMatch: 'full'
  },

  {
    path: 'login/:command',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },

  {
    path: 'debts',
    loadChildren: () => import('./pages/debt-calculator/debt-calculator.module').then(m => m.DebtCalculatorPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'debts:id',
    loadChildren: () => import('./pages/debt-calculator/debt-calculator.module').then(m => m.DebtCalculatorPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'journeys',
    loadChildren: () => import('./pages/journey-list/journey-list.module').then(m => m.JourneyListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'debt-view',
    loadChildren: () => import('./pages/debt-view/debt-view/debt-view.module').then(m => m.DebtViewPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-details',
    loadChildren: () => import('./pages/payment-details/payment-details.module').then(m => m.PaymentDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-details/:editmode/:id',
    loadChildren: () => import('./pages/payment-details/payment-details.module').then(m => m.PaymentDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'journey-editor',
    loadChildren: () => import('./pages/journey-editor/journey-editor.module').then(m => m.JourneyEditorPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'journey-editor/:id',
    loadChildren: () => import('./pages/journey-editor/journey-editor.module').then(m => m.JourneyEditorPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'journey',
    loadChildren: () => import('./pages/journey-details/journey-details.module').then(m => m.JourneyDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'journey/:id',
    loadChildren: () => import('./pages/journey-details/journey-details.module').then(m => m.JourneyDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'journey-evaluate',
    loadChildren: () => import('./pages/journey-evaluate/journey-evaluate.module').then(m => m.JourneyEvaluatePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'join-journey',
    loadChildren: () => import('./pages/join-journey/join-journey.module').then( m => m.JoinJourneyPageModule),
    canActivate: [AuthGuard]
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
