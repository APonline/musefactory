import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
 })
export class HomeComponent implements OnInit {
    currentUser: User;
    //userList: [];
    //userList: Subscription;
    userList: Observable<any>;

    private querySubscription: Subscription;

    constructor(
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private user: UserService
    ) {
      this.user.allUsers();
      this.currentUser = this.authenticationService.currentUserValue;
    }

    async ngOnInit() {
      this.userList = this.user.userList;
    }

    async deleteUser(id) {
      await this.userService.delete(parseInt(id));
    }
}
