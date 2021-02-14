import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';
import { User } from '../types/user';
import { Mutation } from '../types/mutations'
import { Observable } from 'rxjs';
import { Query } from '../types/query';

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
  userExists = false;

  constructor(private apollo: Apollo) {
    this.userListQuery = this.apollo.watchQuery({
      query: ALL_USERS_QUERY,
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    });

    this.users = this.userListQuery.valueChanges;
  }

  async register(userProfile: User) {

    // Check for user first
    await this.getUser(userProfile).then((res) => {
      (res.length === 0 ? this.userExists = false : this.userExists = true);
    });

    if (this.userExists) {
      let error = {
        email: userProfile.email,
        password: userProfile.password,
        error: 1
      };
      return error;
    }

    const user = {
      username: userProfile.username,
      email: userProfile.email.toLowerCase(),
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      password: userProfile.password
    };

    return this.apollo.mutate<Mutation>({
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
    }).pipe(
      map(result => result.data.CreateUser)
    ).toPromise();
  }

  async getUser(userProfile: User) {
    const variables = {
      username: userProfile.username,
      email: userProfile.email
    }

    return this.apollo.query<Query>({
      query: gql`
        query User($username: String, $email: String){
          User(username: $username, email: $email) {
            _id
            id
            name
            username
            firstname
            lastname
            password
            email
          }
        }
      `,
      variables,
      fetchPolicy: 'network-only',
    }).pipe(
      map(result => result.data.User)
    ).toPromise();
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
      updateQuery: (prev, { subscriptionData }) => {
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
