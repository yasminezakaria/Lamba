import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './components/home/login/login.component';
import {RegisterComponent} from './components/home/register/register.component';
import {ProfileComponent} from "./components/profile/profile.component";

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: "profile", loadChildren: './components/profile/profile.module#ProfileModule'},
  
  

  

  // otherwise redirect to home
  {path: '**', redirectTo: '/'}
];

export const routing = RouterModule.forRoot(appRoutes);
