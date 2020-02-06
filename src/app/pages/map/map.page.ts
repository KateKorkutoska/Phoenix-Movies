import {Component, OnInit} from '@angular/core';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker,
    Environment
} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {Observable} from 'rxjs';
// @ts-ignore
import {Cinema} from '../../models/cinema';
import {ToastService} from '../../services/Toast Controller/toast.service';
import {tsCreateElement} from '@angular/compiler-cli/src/ngtsc/typecheck/src/ts_util';


@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
    $cinemas: Observable<Cinema[]>;
    myLocation: Coordinates;
    map: GoogleMap;

    constructor(private geolocation: Geolocation,
                private fireService: FirebaseService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.$cinemas = this.fireService.getCinema();
        this.getLocation();
    }

    getLocation() {
        this.geolocation.getCurrentPosition().then(location => {
            this.myLocation = location.coords;
            this.loadMap();
        });
    }

    loadMap() {
        Environment.setEnv({
            'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCXJ8cbvJGdhOQYOjHk8eCEkHgr57m0GPA',
            'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCXJ8cbvJGdhOQYOjHk8eCEkHgr57m0GPA'
        });

        let mapOptions: GoogleMapOptions = {
            camera: {
                target: {
                    lat: this.myLocation.latitude,
                    lng: this.myLocation.longitude
                },
                zoom: 13,
                tilt: 30
            }
        };

        this.map = GoogleMaps.create('map_canvas', mapOptions);

        let myMarker: Marker = this.map.addMarkerSync({
            title: 'Me',
            icon: '#6a7ad3',
            animation: 'DROP',
            position: {
                lat: this.myLocation.latitude,
                lng: this.myLocation.longitude
            }
        });

        this.$cinemas.subscribe(value => {
            value.forEach(cinema => {
                this.map.addMarkerSync({
                    title: cinema.name + '\n' + cinema.address,
                    icon: '#7c14a8',
                    animation: 'DROP',
                    position: {
                        lat: cinema.latitude,
                        lng: cinema.longitude
                    }
                });
            });
        });

    }
}
