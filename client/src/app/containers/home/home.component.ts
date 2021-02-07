import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
 })
export class HomeComponent implements OnInit {
    currentUser: User;
    userList: any[];

    constructor(
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private user: UserService
    ) {
      this.user.subscribeToUsers();
      this.currentUser = this.authenticationService.currentUserValue;
    }

    async ngOnInit() {
      this.user.users.subscribe(user => {
        console.log(user.data.User)
        this.userList = user.data.User;
      });
    }

    async deleteUser(user) {
      await this.userService.delete(user);
    }
}
