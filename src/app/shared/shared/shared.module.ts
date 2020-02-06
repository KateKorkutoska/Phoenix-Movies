import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MovieComponent} from '../../comoponents/movie/movie.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {ProfileEditComponent} from '../../comoponents/profile-edit/profile-edit.component';
import {MapComponent} from '../../comoponents/map/map.component';
import {AdminComponent} from '../../comoponents/admin/admin.component';
import {ForgotPasswordComponent} from '../../comoponents/forgot-password/forgot-password.component';


@NgModule({
    declarations: [
        MovieComponent,
        MapComponent,
        AdminComponent,
        ForgotPasswordComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule,
        ReactiveFormsModule,
    ],
    exports: [
        IonicModule,
        ReactiveFormsModule,
        ForgotPasswordComponent,
        CommonModule,
        DatePipe,
        FormsModule,
        MapComponent,
        MovieComponent,
        AdminComponent

    ],
    providers: [
        DatePipe

    ]
})
export class SharedModule {
}
