import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },

  {
    path: 'debts/:id',
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
    path: 'payment-details/:editmode/:journeyId',
    loadChildren: () => import('./pages/payment-details/payment-details.module').then(m => m.PaymentDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-details/:editmode/:journeyId/:paymentId',
    loadChildren: () => import('./pages/payment-details/payment-details.module').then(m => m.PaymentDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-details/:editmode/:journeyId/:to/:amount',
    loadChildren: () => import('./pages/payment-details/payment-details.module').then(m => m.PaymentDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-details/:editmode/:journeyId/:to/:amount/:currency',
    loadChildren: () => import('./pages/payment-details/payment-details.module').then(m => m.PaymentDetailsPageModule),
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
    path: 'join-journey',
    loadChildren: () => import('./pages/join-journey/join-journey.module').then(m => m.JoinJourneyPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'journey/:id/invite',
    loadChildren: () => import('./pages/invite-modal/invite-modal.module').then(m => m.InviteModalModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'options',
    loadChildren: () => import('./pages/options/options.module').then(m => m.OptionsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
