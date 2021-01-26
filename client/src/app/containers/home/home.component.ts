import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    users = [];

    constructor(
      private authenticationService: AuthenticationService,
      private userService: UserService
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
      this.loadAllUsers();
    }

    async deleteUser(id) {
      await this.userService.delete(parseInt(id))
        .then(() => {
          this.loadAllUsers()
        });
    }

    async loadAllUsers() {
      this.userService.allUsers()
        .subscribe(users => this.users = users);
    }
}
