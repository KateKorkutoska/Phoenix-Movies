import {Injectable} from '@angular/core';
import {User} from '../../../models/user';
import {Storage} from '@ionic/storage';
import {FirebaseService} from '../../firebase/firebase.service';
import {NavController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class BootstrapingUserService {
    loggedUser: User;

    constructor(private storage: Storage,
                private navCtrl: NavController,
                private toastCtrl: ToastController,
                private fireService: FirebaseService) {
    }

    async presentToast(msg) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 3000,
        });
        toast.present();
    }

    public getLoggedUser(): User {
        return this.loggedUser;
    }

    load() {
        return new Promise((resolve, reject) => {
            this.storage.get('loggedUser').then(val => {
                this.fireService.getUsersList().subscribe(users => {
                    this.loggedUser = users.find(user => user.key === val);
                    console.log(this.loggedUser);
                    resolve(true);
                });
            });
        });

    }
}
