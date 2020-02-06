import {Component, OnInit} from '@angular/core';
// @ts-ignore
import {Movie} from '../../models/movie';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {LoadingController, MenuController} from '@ionic/angular';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../services/Toast Controller/toast.service';
import {UserService} from '../../services/user/user.service';

@Component({
    selector: 'app-coming-soon',
    templateUrl: './coming-soon.page.html',
    styleUrls: ['./coming-soon.page.scss'],
})
export class ComingSoonPage implements OnInit {
    movies: Movie[];
    date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    loaderToShow: any;

    constructor(private fireService: FirebaseService,
                public loadingController: LoadingController,
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




    /*showLoader() {
        this.loaderToShow = this.loadingController.create({
            message: 'Loading, Please Wait...'
        }).then((res) => {
            res.present();

            res.onDidDismiss().then((dis) => {
                console.log('Loading dismissed');
            });
        });
        this.hideLoader();
    }

    hideLoader() {
        this.loadingController.dismiss();
    }*/
}
