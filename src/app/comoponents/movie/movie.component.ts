import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-movie',
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss'],
})
export class MovieComponent {
    @Input() title: string;
    @Input() poster: string;
    @Input() description: string;
    @Input() url: string;
    @Input() navigate: any;
    @Input() landscape: string;
    @Input() cinemas: boolean;

    goToUrl(url) {
        window.location.href = url;
    }

}
