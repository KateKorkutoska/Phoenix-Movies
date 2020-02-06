import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomePage} from './home.page';

const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'movie-details/:id',
        loadChildren: () => import('../movie-details/movie-details.module').then(m => m.MovieDetailsPageModule)
    },
    {
        path: 'edit-movie/:id',
        loadChildren: () => import('../edit-movie/edit-movie.module').then(m => m.EditMoviePageModule)
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {
}
