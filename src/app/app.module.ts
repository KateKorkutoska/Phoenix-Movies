import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player/ngx';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirebaseService} from './services/firebase/firebase.service';
import {AuthService} from './services/auth/auth.service';
import {IonicStorageModule} from '@ionic/storage';
import {SharedModule} from './shared/shared/shared.module';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {BootstrapingUserService} from './services/Bootstraping Services/bootstraping-user/bootstraping-user.service';
import {GoogleMaps} from '@ionic-native/google-maps';
import {BootstrapingMoviesService} from './services/Bootstraping Services/bootstraping-movies/bootstraping-movies.service';
import {ProfileEditComponent} from './comoponents/profile-edit/profile-edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AdminComponent} from './comoponents/admin/admin.component';
import {ForgotPasswordComponent} from './comoponents/forgot-password/forgot-password.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        ProfileEditComponent
    ],
    entryComponents: [
        ProfileEditComponent,
        AdminComponent,
        ForgotPasswordComponent
    ],
    imports: [
        SharedModule,
        BrowserModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        AngularFireDatabase,
        Geolocation,
        AngularFireAuth,
        FirebaseService,
        AuthService,
        BootstrapingUserService,
        GoogleMaps,
        Camera,

        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        YoutubeVideoPlayer
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
