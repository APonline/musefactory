import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeContainer} from './containers/home/home.component';
import { AuthGuard } from './helpers/auth.guard';
import { LandingContainer } from './containers/landing/landing.component';
import { SignupContainer } from './containers/signup/signup.component';

const routes: Routes = [
  { path: '', component: HomeContainer, canActivate: [AuthGuard] },
  { path: 'login', component: LandingContainer },
  { path: 'signup', component: SignupContainer },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

