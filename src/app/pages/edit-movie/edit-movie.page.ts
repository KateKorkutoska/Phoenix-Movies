import {Component, OnInit} from '@angular/core';
import {CameraOptions, Camera} from '@ionic-native/camera/ngx';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// @ts-ignore
import {Movie} from '../../models/movie';
import {ActivatedRoute} from '@angular/router';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {ModalController} from '@ionic/angular';
// @ts-ignore
import {Cinema} from '../../models/cinema';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-edit-movie',
    templateUrl: './edit-movie.page.html',
    styleUrls: ['./edit-movie.page.scss'],
})
export class EditMoviePage implements OnInit {
    editForm: FormGroup;
    cinemas: Cinema[];
    cinemaID: string;
    movie: Movie;
    moviesData: BehaviorSubject<Movie> = new BehaviorSubject<Movie>(undefined);

    constructor(private modalCtrl: ModalController,
                private fireService: FirebaseService,
                private fb: FormBuilder,
                private camera: Camera,
                private route: ActivatedRoute) {
    }


    ngOnInit() {
        this.editForm = this.fb.group({
            buy: [],
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

        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            this.getMoviesList(id).then(movie => {
                this.getCinemas();
                this.moviesData.next(movie);
                this.editForm.patchValue(this.moviesData.value);
            });
        });

    }

    get editFormControls() {
        return this.editForm.controls;
    }

    update(key, cinemaID) {
        this.fireService.updateMovie(key, {
            buy: this.editFormControls.buy.value,
            cast: this.editFormControls.cast.value,
            description: this.editFormControls.description.value,
            director: this.editFormControls.director.value,
            end: this.editFormControls.end.value,
            start: this.editFormControls.start.value,
            landscape: this.editFormControls.landscape.value,
            poster: this.editFormControls.poster.value,
            title: this.editFormControls.title.value,
            trailer: this.editFormControls.trailer.value,
            movieID: this.editFormControls.movieID.value
        }).then(() => {
            console.log('Success');

        });

    }

    getCinemas() {
        this.fireService.getCinema().subscribe(cinemas => {
            this.cinemas = cinemas;
        });
    }

    // @ts-ignore
    filterShowing(movieID): string {
        this.fireService.getShowingMoviesList().subscribe(showing => {
            return showing.find(s => s.movieID === movieID).key;
        });
    }

    getMoviesList(id): Promise<Movie> {
        return new Promise((resolve, reject) => {
            this.fireService.getMoviesList().subscribe(movie => {
                this.movie = movie.find(movie => movie.key === id);
                resolve(this.movie);
            });
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
                                this.editForm.patchValue({
                                    poster: value
                                });
                            } else if (imageKey === 'landscape') {
                                this.editForm.patchValue({
                                    landscape: value
                                });
                            }
                        });
                    });
            }, (err) => {
                // Handle error
                console.log('Error displayed');
            });

    }

    filterCinema($event) {
        this.cinemaID = $event.target.value;
    }


}
