import {NgModule} from '@angular/core';

import {MovieDetailsPageRoutingModule} from './movie-details-routing.module';

import {MovieDetailsPage} from './movie-details.page';
import {SharedModule} from '../../shared/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        MovieDetailsPageRoutingModule
    ],
    declarations: [MovieDetailsPage]
})
export class MovieDetailsPageModule {
}
