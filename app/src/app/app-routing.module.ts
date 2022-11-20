import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'debts',
    loadChildren: () => import('./pages/debt-calculator/debt-calculator.module').then( m => m.DebtCalculatorPageModule)
  },
  {
    path: 'journeys',
    loadChildren: () => import('./pages/journey-list/journey-list.module').then( m => m.JourneyListPageModule)
  },
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'payment-details',
    loadChildren: () => import('./pages/payment-details/payment-details.module').then( m => m.PaymentDetailsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'journey-editor',
    loadChildren: () => import('./pages/journey-editor/journey-editor.module').then( m => m.JourneyEditorPageModule)
  },
  {
    path: 'journey-details',
    loadChildren: () => import('./pages/journey-details/journey-details.module').then( m => m.JourneyDetailsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
