import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'testing',
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
    path: 'debt-view',
    loadChildren: () => import('./pages/debt-view/debt-view/debt-view.module').then( m => m.DebtViewPageModule)
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
    path: 'journey-editor/:edit/:name/:cur/:start/:code/:people',
    loadChildren: () => import('./pages/journey-editor/journey-editor.module').then( m => m.JourneyEditorPageModule)
  },
  {
    path: 'journey-details',
    loadChildren: () => import('./pages/journey-details/journey-details.module').then( m => m.JourneyDetailsPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'journey-evaluate',
    loadChildren: () => import('./pages/journey-evaluate/journey-evaluate.module').then(m => m.JourneyEvaluatePageModule)
  },  {
    path: 'join-journey',
    loadChildren: () => import('./pages/join-journey/join-journey.module').then( m => m.JoinJourneyPageModule)
  },
  {
    path: 'options',
    loadChildren: () => import('./pages/options/options.module').then( m => m.OptionsPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
