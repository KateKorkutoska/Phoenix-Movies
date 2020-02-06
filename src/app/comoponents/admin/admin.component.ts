import {Component, OnInit} from '@angular/core';
import {ModalController, Platform, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from '../../services/firebase/firebase.service';
// @ts-ignore
import {Cinema} from '../../models/cinema';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../models/user';
import {ToastService} from '../../services/Toast Controller/toast.service';


@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
    cinemaForm: FormGroup;
    movieForm: FormGroup;
    type: boolean;
    cinemas: Cinema[];
    cinemaID: string;
    users: User[];
    usersMail: string;

    constructor(private modalCtrl: ModalController,
                private fireService: FirebaseService,
                private authService: AuthService,
                private fb: FormBuilder,
                private camera: Camera,
                private plt: Platform,
                private toastService: ToastService,
    ) {
    }

    ngOnInit() {
        this.getCinemas();
        this.getUsers();
        this.cinemaForm = this.fb.group({
            cinemaID: ['', Validators.required],
            address: ['', Validators.required],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required],
            link: [''],
            name: ['', Validators.required]
        });
        this.movieForm = this.fb.group({
            buy: [''],
            cast: [''],
            description: [''],
            director: ['', Validators.required],
            end: ['', Validators.required],
            start: ['', Validators.required],
            landscape: ['', Validators.required],
            poster: ['', Validators.required],
            title: ['', Validators.required],
            trailer: ['', Validators.required],
            movieID: ['', Validators.required]
        });
    }

    get movieFormControls() {
        return this.movieForm.controls;
    }

    createMovie(cinemaId?) {
        this.authService.sendMail({'email': this.usersMail, 'title': this.movieFormControls.title.value}).subscribe(val => {
            this.fireService.createMovie(this.movieForm.value);
            if (cinemaId !== undefined) {
                this.fireService.createShowingMovies({cinemaID: cinemaId, movieID: this.movieFormControls.movieID.value});
                this.toastService.presentToast("Movie was added")
                this.dismiss();
            }
        }, error => {
            this.toastService.presentToast("Movie was not added")
        });
    }

    getUsers() {
        const usersArray = new Array<any>(0);
        this.usersMail = null;
        this.fireService.getUsersList().subscribe(users => {
            users.forEach(value => {
                usersArray.push(value.email);
            });
            this.usersMail = usersArray.toString();
        });
    }

    getCinemas() {
        this.fireService.getCinema().subscribe(cinemas => {
            this.cinemas = cinemas;
        });
    }

    createCinema() {
        this.fireService.createCinema(this.cinemaForm.value);
        this.dismiss()
    }

    filterCinema($event) {
        this.cinemaID = $event.target.value;
    }

    change(e) {
        if (e.target.value === '1') {
            this.type = true;
        } else if (e.target.value === '2') {
            this.type = false;
        }
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalCtrl.dismiss({
            'dismissed': true
        });
    }

    takePicture(imageKey: string) {
        const options: CameraOptions = {
            quality: 25,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options)
            .then((imageData) => {
                console.log(`${imageData} capture`);
                this.fireService.upload(imageData)
                    .then((snapshot) => {
                        snapshot.ref.getDownloadURL().then(value => {
                            if (imageKey === 'poster') {
                                this.movieForm.patchValue({
                                    poster: value
                                });
                            } else if (imageKey === 'landscape') {
                                this.movieForm.patchValue({
                                    landscape: value
                                });
                            }
                        });
                    });
            }, (err) => {
                // Handle error
                this.toastService.presentToast("Upload was unsuccessful");
            });

    }

}
