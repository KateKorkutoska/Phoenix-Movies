import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth/auth.service';
import {Storage} from '@ionic/storage';
import {MenuController, ModalController, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {FirebaseService} from '../../../services/firebase/firebase.service';
import {UserService} from '../../../services/user/user.service';
import {ToastService} from '../../../services/Toast Controller/toast.service';
import {ProfileEditComponent} from '../../../comoponents/profile-edit/profile-edit.component';
import {ForgotPasswordComponent} from '../../../comoponents/forgot-password/forgot-password.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;

    constructor(private fb: FormBuilder,
                private menuCtrl: MenuController,
                private storage: Storage,
                private authService: AuthService,
                private userService: UserService,
                private router: Router,
                private navCtrl: NavController,
                private modalController: ModalController,
                private fireService: FirebaseService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.menuCtrl.enable(false);
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get loginFormControls() {
        return this.loginForm.controls;
    }

    login() {
        this.authService.SignIn(this.loginFormControls.email.value, this.loginFormControls.password.value).then(() => {
            this.getUsers(this.loginFormControls.email.value).then(() => {
                this.loginForm.reset();
                this.menuCtrl.enable(true);
                this.router.navigate(['/home'], {replaceUrl: true});
                this.toastService.presentToast('Welcome back');

            });
        }, err => {
            this.toastService.presentToast('Please enter a valid email and password');
        });
    }

    getUsers(email): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.fireService.getUsersList().subscribe(users => {
                const user = users.find(u => u.email === email);
                this.userService.setUser(user);
                resolve(true);
            }, err => {
                reject(true);
            });
        });
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: ForgotPasswordComponent,
        });
        return await modal.present();
    }

}
