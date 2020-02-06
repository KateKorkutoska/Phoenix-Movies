import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {map, retry} from 'rxjs/operators';
// @ts-ignore
import {Cinema} from '../../models/cinema';
// @ts-ignore
import {Movie} from '../../models/movie';
import {User} from '../../models/user';
import * as firebase from 'firebase';
import {Upload} from '../../models/upload';
import {ShowingMovies} from '../../models/showingMovies';
import {Watchlist} from '../../models/watchlist';


@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    userbyid = firebase.database().ref('/users');

    usersRef: AngularFireList<any> = null;
    userUrl = '/users';
    private uploadTask: firebase.storage.UploadTask;
    storageTask: any;

    captureDataUrl: string;
    movieRef: AngularFireList<any> = null;
    movieUrl = '/movies';

    cinemaRef: AngularFireList<any> = null;
    cinemaUrl = '/cinemas';

    showingMoviesRef: AngularFireList<any> = null;
    showingMoviesUrl = '/showing';

    watchlistRef: AngularFireList<Watchlist> = null;
    watchlistUrl = '/watchlist';

    constructor(private fire: AngularFireDatabase) {
        this.usersRef = fire.list(this.userUrl);
        this.movieRef = fire.list(this.movieUrl);
        this.cinemaRef = fire.list(this.cinemaUrl);
        this.showingMoviesRef = fire.list(this.showingMoviesUrl);
        this.watchlistRef = fire.list(this.watchlistUrl);
    }

    createUser(value): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.usersRef.push(value);
            resolve(true);
        });
    }

    getUsersbyId(id): Promise<User> {
        return new Promise((resolve, reject) => {
            this.userbyid.child(id).once('value', snapshot => {
                resolve(snapshot.val());
            });
        });
    }

    getCurrentUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(firebase.auth().currentUser);
        });
    }

    getUsers() {
        return this.usersRef;
    }


    getUsersList(): Observable<User[]> {
        return this.getUsers().snapshotChanges().pipe(
            map(changes =>
                changes.map(c =>
                    ({key: c.payload.key, ...c.payload.val()})
                )
            )
        );
    }


    updateUser(key: string, value: any) {
        return this.usersRef.update(key, value);
    }

    upload(captureDataUrl) {
        let storageRef = firebase.storage().ref();
        // Create a timestamp as filename

        const filename = Math.floor(Date.now() / 1000);

        // Create a reference to 'images/todays-date.jpg'

        const imageRef = storageRef.child(`images/${filename}.jpg`);

        const metadata = {
            contentType: 'image/jpeg'
        };

        return imageRef.putString(captureDataUrl, firebase.storage.StringFormat.BASE64, metadata);
    }


    deleteUser(key: string): Promise<any> {
        return this.usersRef.remove(key);
    }

    createWatchlist(value) {
        this.watchlistRef.push(value);
    }

    getWatchlist() {
        return this.watchlistRef;
    }

    getWatchlistList(): Observable<Watchlist[]> {
        return this.getWatchlist().snapshotChanges().pipe(
            map(changes =>
                changes.map(c =>
                    ({key: c.payload.key, ...c.payload.val()})
                )
            )
        );
    }


    updateWatchlist(key: string, value: any) {
        return this.watchlistRef.update(key, value);
    }

    deleteWatchlist(key: string): Promise<any> {
        return this.watchlistRef.remove(key);
    }

    createCinema(value) {
        return this.cinemaRef.push(value);
    }

    updateCinema(key: string, value: any): Promise<any> {
        return this.cinemaRef.update(key, value);
    }

    deleteCinema(key: string): Promise<any> {
        return this.cinemaRef.remove(key);
    }


    getCinema(): Observable<Cinema[]> {
        return this.cinemaRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c =>
                    ({ket: c.payload.key, ...c.payload.val()})
                )
            )
        );
    }

    createShowingMovies(value) {
        return this.showingMoviesRef.push(value);
    }

    getShowingMovies() {
        return this.showingMoviesRef;
    }

    getShowingMoviesList(): Observable<ShowingMovies[]> {
        return this.getShowingMovies().snapshotChanges().pipe(
            map(changes =>
                changes.map(c =>
                    ({key: c.payload.key, ...c.payload.val()})
                )
            )
        );
    }

    updateShowingMovies(key: string, value: any) {
        return this.showingMoviesRef.update(key, value);
    }

    deleteShowingMovies(key: string): Promise<any> {
        return this.showingMoviesRef.remove(key);
    }

    createMovie(value) {
        this.movieRef.push(value);
    }

    getMovies() {
        return this.movieRef;
    }

    getMoviesList(): Observable<Movie[]> {
        return this.getMovies().snapshotChanges().pipe(
            map(changes =>
                changes.map(c =>
                    ({key: c.payload.key, ...c.payload.val()})
                )
            )
        );
    }


    updateMovie(key: string, value: any) {
        return this.movieRef.update(key, value);
    }

    deleteMovie(key: string): Promise<any> {
        return this.movieRef.remove(key);
    }
}
