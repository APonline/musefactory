import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../types/user';
import { Query } from '../types/query'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    use = '';

    constructor(private apollo: Apollo) {
      this.use = localStorage.getItem('currentUser');

        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.use));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username, password) {
      const variables = {
        username,
        password
      };
      return this.apollo.query<Query>({
        query: gql`
          query Login($username: String, $password: String) {
            Login(username: $username, password: $password) {
              id
              name
              username
              firstname
              lastname
              password
              email
              dateCreated {
                formatted
              }
              active
            }
          }
        `,
        variables
      }).pipe(
        map(result => {
          const user = result.data.Login;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      ).toPromise();
    }

    /*login(username, password) {
        return this.http.post<any>(`${process.env.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }*/

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
