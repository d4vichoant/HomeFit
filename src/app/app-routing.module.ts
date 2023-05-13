import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'notification-permission',
    loadChildren: () => import('./notification-permission/notification-permission.module').then( m => m.NotificationPermissionPageModule)
  },
  {
    path: 'profile-basic',
    loadChildren: () => import('./profile-basic/profile-basic.module').then( m => m.ProfileBasicPageModule)
  },
  {
    path: 'gender',
    loadChildren: () => import('./gender/gender.module').then( m => m.GenderPageModule)
  },
  {
    path: 'brithday',
    loadChildren: () => import('./brithday/brithday.module').then( m => m.BrithdayPageModule)
  },  {
    path: 'w-and-h',
    loadChildren: () => import('./w-and-h/w-and-h.module').then( m => m.WAndHPageModule)
  },
  {
    path: 'exercise-frequency',
    loadChildren: () => import('./exercise-frequency/exercise-frequency.module').then( m => m.ExerciseFrequencyPageModule)
  },
  {
    path: 'objetive',
    loadChildren: () => import('./objetive/objetive.module').then( m => m.ObjetivePageModule)
  },
  {
    path: 'password',
    loadChildren: () => import('./password/password.module').then( m => m.PasswordPageModule)
  },
  {
    path: 'profession',
    loadChildren: () => import('./profession/profession.module').then( m => m.ProfessionPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'select',
    loadChildren: () => import('./select/select.module').then( m => m.SelectPageModule)
  },
  {
    path: 'specialty',
    loadChildren: () => import('./specialty/specialty.module').then( m => m.SpecialtyPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
