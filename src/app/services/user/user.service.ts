import {Injectable} from '@angular/core';
import {User} from '../../models/user';
import {Storage} from '@ionic/storage';
import {FirebaseService} from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    loggedInUser: User;

    constructor(private storage: Storage, private fireService: FirebaseService) {
    }

    getUser(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.storage.get('loggedUser').then(val => {
                this.fireService.getUsersList().subscribe(users => {
                    this.loggedInUser = users.find(user => user.key === val);
                    resolve(true);
                }, err => {
                    reject(true);
                });
            }).catch(err => {
                reject(true);
            });
        });
    }

    setUser(user: User) {
        this.storage.set('loggedUser', user.key).then(() => {
            this.loggedInUser = user;
        });
    }

}
