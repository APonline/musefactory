import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss']
})
export class UserContainer implements OnInit {
  currentUser: User;
  userList: any[];

  constructor(
    private authenticationService: AuthenticationService,
    private user: UserService
  ) {
    this.user.subscribeToUsers();
    this.currentUser = this.authenticationService.currentUserValue;
  }

  async ngOnInit() {
    this.user.users.subscribe(user => {
      this.userList = user.data.User;
    });
  }

  async deleteUser(user) {
    await this.user.delete(user);
  }
}
