import {Component, OnInit, ViewChild} from '@angular/core';

import {AlertController, IonRouterOutlet, MenuController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {AuthService} from './services/auth/auth.service';
import {BootstrapingUserService} from './services/Bootstraping Services/bootstraping-user/bootstraping-user.service';
import {UserService} from './services/user/user.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild(IonRouterOutlet, {static: false}) routerOutlet: IonRouterOutlet;
    public appPages = [
        {
            title: 'In Cinemas',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'Watch At Home',
            url: '/history',
            icon: 'tv'
        },
        {
            title: 'Coming Soon',
            url: '/coming-soon',
            icon: 'videocam'
        },
        {
            title: 'Map',
            url: '/map',
            icon: 'map'
        },
        {
            title: 'Log Out',
            icon: 'log-out'
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private storage: Storage,
        private router: Router,
        public alert: AlertController,
        private authService: AuthService,
        private menu: MenuController,
        private userService: UserService
    ) {
        this.initializeApp();
        this.platform.backButton.subscribe(() => {
            if (this.router.url === '/entry'
                || this.router.url === '/home'
                || this.router.url === '/history'
                || this.router.url === '/coming-soon'
                || this.router.url === '/map') {
                this.showAlert(this.router.url);
                // navigator['app'].exitApp();
            } else if (this.routerOutlet && this.routerOutlet.canGoBack()) {
                this.routerOutlet.pop();
            }
        });

    }

    async showAlert(url) {
        const alert = await this.alert.create({
            header: 'Exit',
            subHeader: 'Do you want to exit the app?',
            buttons: [{
                text: 'Yes',
                handler: () => {
                    navigator['app'].exitApp();
                }
            }, {
                text: 'No',
                handler: () => {
                    this.router.navigateByUrl(url);
                    this.alert.dismiss();
                }
            }]
        });
        await alert.present();
    }

    pages(page) {
        if (page === 'Log Out') {
            this.storage.set('loggedUser', 0);
            this.router.navigate(['/entry'], {replaceUrl: true});
            this.menu.enable(false);
        }
    }

    initializeApp() {
        this.userService.getUser().then(() => {
            this.platform.ready().then(() => {
                this.storage.get('loggedUser').then(val => {
                    if (val === null || val === 0) {
                        this.router.navigate(['/entry']);

                    } else {
                        this.router.navigate(['/home']);
                    }
                });
                // this.statusBar.styleDefault();
                this.splashScreen.hide();
            });
        });
    }

    navigateToProfile() {
        this.router.navigate(['/profile']).then(() => {
            this.menu.close();
        });
    }

    ngOnInit(): void {

    }
}
