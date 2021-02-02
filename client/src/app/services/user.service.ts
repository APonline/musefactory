import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import { User } from '../types/user';
import { Mutation } from '../types/mutations'
import { Query } from '../types/query'
import { interval, Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import {Observable} from 'rxjs';

const ALL_USERS_SUB = gql`
  subscription onAllUsers {
    allUsers {
        _id
        name
        username
        firstname
        lastname
        password
        email
    }
  }
`;

const ALL_USERS_QUERY = gql`
    query allUsers {
      User {
        _id
        name
        username
        firstname
        lastname
        password
        email
      }
    }
  `;



@Injectable({ providedIn: 'root' })
export class UserService {

  userListQuery: QueryRef<any>;
  users: Observable<any>;

    constructor(private apollo: Apollo) {
      this.userListQuery = this.apollo.watchQuery({
        query: ALL_USERS_QUERY,
        notifyOnNetworkStatusChange: true
      });

      this.users = this.userListQuery.valueChanges;
    }

    register(userProfile: User) {
      const user = {
        username: userProfile.username,
        email: userProfile.email.toLowerCase(),
        firstname: userProfile.firstname,
        lastname: userProfile.lastname,
        password: userProfile.password
      };

      this.apollo.mutate<Mutation>({
        mutation: gql`
          mutation MergeUser(
            $user: UserInput
          ) {
            MergeUser(
              user: $user
            ) {
              _id
              username
              password
            }
          }
        `,
        variables: {
          user
        },
        refetchQueries: [{
          query: ALL_USERS_QUERY
        }]
      })
      .subscribe(() => {
        console.log('new user');
      });
    }

    subscribeToNewUsers() {
      this.userListQuery.subscribeToMore({
        document: ALL_USERS_SUB,
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) {
            return prev;
          }

          const newUserItem = subscriptionData.data.allUsers;

          return {
            ...prev,
            entry: {
              users: [newUserItem, ...prev.entry.users]
            }
          };
        }
      });
    }

    delete(id) {
      return this.apollo.mutate<Mutation>({
        mutation: gql`
          mutation DeleteUser(
            $id: Int
          ) {
            DeleteUser(
              id: $id
            ) {
              _id
              username
            }
          }
        `,
        variables: {
          id
        }
      }).pipe(
        map(result => result.data)
      ).toPromise();
    }
}
