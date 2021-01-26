import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { User } from '../types/user';
import { Mutation } from '../types/mutations'
import { Query } from '../types/query'

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private apollo: Apollo) { }

    register(userProfile: User) {
      const user = {
        username: userProfile.username,
        email: userProfile.email.toLowerCase(),
        firstname: userProfile.firstname,
        lastname: userProfile.lastname,
        password: userProfile.password
      };

      return this.apollo.mutate<Mutation>({
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
        }
      }).pipe(
        map(result => result.data)
      ).toPromise();
    }

    allUsers() {
      return this.apollo.query<Query>({
        query: gql`
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
          `
      }).pipe(
        map(result => result.data.User),
      );
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

    /*getAll() {
        return this.http.get<User[]>(`${process.env.apiUrl}/users`);
    }

    register(user: User) {
        return this.http.post(`${process.env.apiUrl}/users/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`${process.env.apiUrl}/users/${id}`);
    }*/
}
