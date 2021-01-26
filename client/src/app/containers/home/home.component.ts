import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    userList: Observable<User[]>;

    constructor(
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private user: UserService
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
    }

    async ngOnInit() {
      this.userList = this.user.allUsers();
    }

    async deleteUser(id) {
      await this.userService.delete(parseInt(id));
    }
}
