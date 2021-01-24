import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../types/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${process.env.apiUrl}/users`);
    }

    register(user: User) {
        return this.http.post(`${process.env.apiUrl}/users/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`${process.env.apiUrl}/users/${id}`);
    }
}
