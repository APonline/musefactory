import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { AuthenticationService } from './services/authentication.service';
import { User } from './types/user';

@Component({
  selector: 'app-root',
  animations: [
    trigger('routerAnimation', [
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'absolute', left: 0, width: '100%', minHeight: '100%'}), { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)', opacity: 0 }),
            animate('0.8s ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)', opacity: 1 }),
            animate('0.3s ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
          ], { optional: true }),
        ])
      ])
    ])
  ],
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    getRouteAnimation(outlet) {
      return outlet.activatedRouteData.animation;
    }
}
