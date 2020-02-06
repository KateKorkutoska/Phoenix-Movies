import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {ModalController} from '@ionic/angular';
import {ProfileEditComponent} from '../../comoponents/profile-edit/profile-edit.component';
import {UserService} from '../../services/user/user.service';
import {ToastService} from '../../services/Toast Controller/toast.service';
import {Watchlist} from '../../models/watchlist';
// @ts-ignore
import {Movie} from '../../models/movie';
import {FirebaseService} from '../../services/firebase/firebase.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    watchlist: Watchlist[];
    movies: Movie[];

    constructor(private userService: UserService,
                private fireService: FirebaseService,
                public modalController: ModalController,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.getWatchlist();
        this.movies = new Array(0);
        this.userService.getUser().then(() => {
            this.fireService.getMoviesList().subscribe(movies => {
                this.watchlist.forEach(w => {
                    let movie = movies.find(m => m.key === w.movieId && this.userService.loggedInUser.key === w.userId);
                    if (movie !== undefined) {
                        this.movies.push(movie);
                    }
                    console.log(this.movies);
                });
            });
        });
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: ProfileEditComponent,
            componentProps: {
                'userData': this.userService.loggedInUser
            }
        });
        return await modal.present();
    }

    getWatchlist() {
        this.fireService.getWatchlistList().subscribe(watchlist => {
            this.watchlist = watchlist;
        });
    }

    removeMovie(movie, key) {
        let watchlist = this.watchlist.find(w => w.movieId === movie);
        this.movies.splice(key, 1);
        this.fireService.deleteWatchlist(watchlist.key);

    }
}
