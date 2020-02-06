import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    forgotPassword: FormGroup;

    constructor(private modalCtrl: ModalController, private authService: AuthService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.forgotPassword = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalCtrl.dismiss({
            'dismissed': true
        });
    }

    forget() {
        console.log(this.forgotPassword.value);
        this.authService.ForgotPassword(this.forgotPassword.controls.email.value).then(() => {

        });
    }


}
;
