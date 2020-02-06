import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from '../../../services/firebase/firebase.service';
import * as CryptoJS from 'crypto-js';
import {AuthService} from '../../../services/auth/auth.service';
import {MenuController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {ToastService} from '../../../services/Toast Controller/toast.service';
import {error} from 'util';
import {UserService} from '../../../services/user/user.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    registerForm: FormGroup;

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private fireService: FirebaseService,
                private menuCtrl: MenuController,
                private storage: Storage,
                private router: Router,
                private toastService: ToastService,
                private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.menuCtrl.enable(false);
        this.registerForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            surname: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            admin: false,
            img: 'https://firebasestorage.googleapis.com/v0/b/movieapp-8d481.appspot.com/o/profile.webp?alt=media&token=2bfa807a-bd38-4fc0-a571-509f1f6f2b4a'
        })
        ;
    }

    get registerFormControls() {
        return this.registerForm.controls;
    }

    create() {
        this.authService.SignUp(this.registerFormControls.email.value, this.registerFormControls.password.value, this.registerForm.value).then(() => {
            console.log('Successful Registration');
            this.getUsers(this.registerFormControls.email.value).then(() => {
                this.registerForm.patchValue({
                    password: CryptoJS.SHA1(this.registerFormControls.password.value).words
                });
                this.menuCtrl.enable(true);
                this.registerForm.reset();
                this.toastService.presentToast('Registration successful');
                this.router.navigateByUrl('/home');
            });


        }, error => {
            this.toastService.presentToast("Insert valid information");
        });

    }

    getUsers(email): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.fireService.getUsersList().subscribe(users => {
                const user = users.find(u => u.email === email);
                this.userService.setUser(user);
                resolve(true);
                this.toastService.presentToast("Email sent")
            }, err => {
                reject(true);
                this.toastService.presentToast("Email not sent")
            });
        });
    }
}
