import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import { User } from '../types/user';
import { Mutation } from '../types/mutations'
import {Observable} from 'rxjs';

const USER_SUB = gql`
  subscription onUsersChange {
    usersChange {
      mutation
      data
      previousValues
    }
  }
`;

const ALL_USERS_QUERY = gql`
    query allUsers {
      User {
        id
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
        fetchPolicy: 'network-only',
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
          mutation CreateUser(
            $user: UserInput
          ) {
            CreateUser(
              user: $user
            ) {
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
        variables: {
          user
        }
      })
      .subscribe();
    }

    delete(user) {
      return this.apollo.mutate<Mutation>({
        mutation: gql`
          mutation DeleteUser(
            $user: UserInput
          ) {
            DeleteUser(
              user: $user
            ) {
              id
            }
          }
        `,
        variables: {
          user
        }
      }).pipe(
        map(result => result.data)
      ).toPromise();
    }



    subscribeToUsers() {
      this.userListQuery.subscribeToMore({
        document: USER_SUB,
        updateQuery: (prev, {subscriptionData}) => {
          const newUserItem = subscriptionData.data.usersChange.data;
          const mutationType = subscriptionData.data.usersChange.mutation;
          let updatedValues;

          if (mutationType === 'CREATED') {
            updatedValues = {
              ...prev,
              User: [...prev.User, newUserItem]
            };
          }

          if (mutationType === 'DELETED') {
            updatedValues = {
              ...prev,
              User: prev.User.filter(user => user.id !== subscriptionData.data.usersChange.previousValues.id)
            };
          }

          return updatedValues;
        },
        onError: (err) => console.error(err),
      });
    }
}
