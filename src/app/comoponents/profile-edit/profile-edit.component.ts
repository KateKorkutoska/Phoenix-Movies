import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '../../services/Toast Controller/toast.service';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {UserService} from '../../services/user/user.service';

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.component.html',
    styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
    @Input() userData: User;
    userForm: FormGroup;
    imageToBeUploaded: string;

    constructor(private modalCtrl: ModalController, private fireService: FirebaseService,
                private authService: AuthService, private fb: FormBuilder,
                private router: Router, private camera: Camera, private userService: UserService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.userForm = this.fb.group({
            name: [this.userData.name, [Validators.required, Validators.minLength(3)]],
            surname: [this.userData.surname, [Validators.required, Validators.minLength(2)]],
            email: [this.userData.email, [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            newMail: [this.userData.email, [Validators.required, Validators.email]],
            img: [this.userData.img, [Validators.required]]
        });
    }


    takePicture() {
        const options: CameraOptions = {
            quality: 25,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
        };
        this.camera.getPicture(options)
            .then((imageData) => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64:
                console.log(`${imageData} capture`);
                this.imageToBeUploaded = 'data:image/jpeg;base64,' + imageData;
                this.fireService.upload(imageData)
                    .then((snapshot) => {
                        snapshot.ref.getDownloadURL().then(value => {
                            this.userForm.patchValue({
                                img: value
                            });
                        });
                    });
            }, (err) => {
                // Handle error
                console.log('Error displayed');
            });

    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalCtrl.dismiss({
            'dismissed': true
        });
    }

    get userFormControls() {
        return this.userForm.controls;
    }

    update() {
        this.authService.updateUser(this.userFormControls.email.value,
            this.userFormControls.password.value,
            this.userFormControls.newMail.value).then(() => {
            this.fireService.updateUser(this.userService.loggedInUser.key, {
                name: this.userFormControls.name.value,
                surname: this.userFormControls.surname.value,
                email: this.userFormControls.newMail.value,
                img: this.userFormControls.img.value
            }).then(() => {
                this.toastService.presentToast('Your profile has been updated');
                this.router.navigate(['/profile']);
                this.modalCtrl.dismiss();
            });
        });
    }
}
