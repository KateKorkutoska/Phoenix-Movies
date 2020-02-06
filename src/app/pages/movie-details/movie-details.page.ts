import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {ActivatedRoute} from '@angular/router';
// @ts-ignore
import {Movie} from '../../models/movie';
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player/ngx';
import {ShowingMovies} from '../../models/showingMovies';
// @ts-ignore
import {Cinema} from '../../models/cinema';
import {UserService} from '../../services/user/user.service';
import {Watchlist} from '../../models/watchlist';
import {forEach} from '@angular-devkit/schematics';
import {ToastService} from '../../services/Toast Controller/toast.service';
import {GoogleMap} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@Component({
    selector: 'app-movie-details',
    templateUrl: './movie-details.page.html',
    styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {
    movie: Movie;
    showingMovies: ShowingMovies[];
    cinemas: Cinema[];
    showMapButton: boolean;
    watchlist: Watchlist[];
    watch: Watchlist[];
    closest: Cinema;
    showInfo: boolean;

    constructor(private fireService: FirebaseService,
                private youtube: YoutubeVideoPlayer,
                private route: ActivatedRoute,
                private userService: UserService,
                private toastService: ToastService,
                private geolocation: Geolocation,
    ) {
    }

    ngOnInit() {
        this.getShowingMovies();
        this.userService.getUser().then(() => {
                this.route.paramMap.subscribe(params => {
                    const id = params.get('id');
                    this.fireService.getMoviesList().subscribe(movies => {
                        this.movie = movies.find(movie => movie.key === id);
                        this.getWatchlist();
                        this.getCinemas();

                    });

                });
                this.fireService.getWatchlistList().subscribe(watchlist => {
                    this.watchlist = watchlist.filter(w => w.userId === this.userService.loggedInUser.key);
                });
            }
        );
    }

    openVideo(video) {
        this.youtube.openVideo(video);
    }

    getShowingMovies() {
        this.fireService.getShowingMoviesList().subscribe(movies => {
            this.showingMovies = movies;
        });
    }

    getWatchlist() {
        this.fireService.getWatchlistList().subscribe(watchlist => {
            this.watch = watchlist;
        });
    }

    checkWatchlist(userKey, movieKey): boolean {
        if (this.watch !== undefined) {
            const match = this.watch.find(watchlist => watchlist.userId === userKey && watchlist.movieId === movieKey);
            if (match !== undefined) {
                return false;
            } else {
                return true;
            }
        }
    }

    getCinemas() {
        this.cinemas = new Array(0);
        this.fireService.getCinema().subscribe(cinemas => {
            let showing = this.showingMovies.filter(movie => movie.movieID === this.movie.movieID);
            showing.forEach(movie => {
                movie.cinemaID.forEach(id => {
                    cinemas.filter(cinema => cinema.cinemaID === id).forEach(cinema => {
                        this.cinemas.push(cinema);
                    });
                });

            });
            console.log(this.cinemas);
        });
    }


    showMap() {
        if (this.showMapButton === true) {
            this.showMapButton = false;
        } else {
            this.showMapButton = true;
        }
    }

    addToWatchlist(key) {
        this.fireService.createWatchlist({movieId: key, userId: this.userService.loggedInUser.key});
        this.toastService.presentToast('This movie is added to your watchlist');
    }


    getUrl() {
        return window.location.pathname.slice(1, 8);
    }

    goToUrl(url) {
        window.location.href = url;
    }

    removeWatchlist(movieKey) {
        const match = this.watch.find(w => w.movieId === movieKey);
        if (match !== undefined) {
            this.fireService.deleteWatchlist(match.key);
            this.toastService.presentToast('This movie is removed from your watchlist');
        }
    }

    findClosestCinema (){
        this.geolocation.getCurrentPosition().then(myLocation => {
            this.cinemas.sort((a, b) => {
                if (this.distance(myLocation.coords.latitude,myLocation.coords.longitude,a.latitude, a.longitude) < this.distance(myLocation.coords.latitude,myLocation.coords.longitude,b.latitude, b.longitude))
                    return -1;
                if (this.distance(myLocation.coords.latitude,myLocation.coords.longitude,a.latitude, a.longitude) > this.distance(myLocation.coords.latitude,myLocation.coords.longitude,b.latitude, b.longitude))
                    return 1;
                return 0
            });
            this.closest = this.cinemas[0];
        });
        return this.showInfo=true
    }

    distance(lat1,lon1,lat2,lon2){
        function deg2rad(number: number) {
            return number * (Math.PI/180)
        }
        var R = 6371;
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    }


}
