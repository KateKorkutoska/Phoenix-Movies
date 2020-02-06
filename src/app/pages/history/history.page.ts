import {Component, OnInit} from '@angular/core';
// @ts-ignore
import {Movie} from '../../models/movie';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {MenuController} from '@ionic/angular';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../services/Toast Controller/toast.service';
import {UserService} from '../../services/user/user.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
    movies: Movie[];
    date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    constructor(private fireService: FirebaseService,
                private menuCtrl: MenuController,
                private datePipe: DatePipe,
                private toastService: ToastService,
                private userService: UserService) {
    }

    ngOnInit() {
        this.menuCtrl.enable(true);
        this.fireService.getMoviesList().subscribe(movie => {
            this.movies = movie;
        });
    }


}
