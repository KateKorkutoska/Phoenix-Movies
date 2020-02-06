import {Injectable} from '@angular/core';
import {User} from '../../../models/user';
import {Storage} from '@ionic/storage';
import {FirebaseService} from '../../firebase/firebase.service';
// @ts-ignore
import {Movie} from '../../../models/movie';

@Injectable({
    providedIn: 'root'
})
export class BootstrapingMoviesService {

    movies: Movie[];

    constructor(private storage: Storage, private fireService: FirebaseService) {
    }

    public getMovies(): Movie[] {
        return this.movies;
    }

    load() {
        return new Promise((resolve, reject) => {
            this.fireService.getMoviesList().subscribe(movies => {
                this.movies = movies;
                resolve(true);
            });
        });
    }
}
