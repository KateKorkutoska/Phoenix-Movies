import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {MenuController, ModalController} from '@ionic/angular';
// @ts-ignore
import {Movie} from '../../models/movie';
import {DatePipe} from '@angular/common';
import {Observable} from 'rxjs';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../services/auth/auth.service';
import {ToastService} from '../../services/Toast Controller/toast.service';
import {UserService} from '../../services/user/user.service';
import {ProfileEditComponent} from '../../comoponents/profile-edit/profile-edit.component';
import {AdminComponent} from '../../comoponents/admin/admin.component';


@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    $movies: Observable<Movie[]>;
    date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    constructor(private fireService: FirebaseService,
                private menuCtrl: MenuController,
                private datePipe: DatePipe,
                private storage: Storage,
                private authService: AuthService,
                private toastService: ToastService,
                private userService: UserService,
                private modalController: ModalController
    ) {
    }

    ngOnInit() {
        this.userService.getUser().then(() => {
            this.menuCtrl.enable(true);
            this.$movies = this.fireService.getMoviesList();
        });

    }

    openMenu() {
        this.menuCtrl.open();
    }
    async presentModal() {
        const modal = await this.modalController.create({
            component: AdminComponent,
        });
        return await modal.present();
    }

}
