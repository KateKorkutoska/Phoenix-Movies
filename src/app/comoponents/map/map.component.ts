import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
// @ts-ignore
import {Cinema} from '../../models/cinema';
import {Environment, GoogleMap, GoogleMapOptions, GoogleMaps, Marker} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {FirebaseService} from '../../services/firebase/firebase.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    @Input() $cinemas: Cinema[];
    myLocation: Coordinates;
    map: GoogleMap;

    constructor(private geolocation: Geolocation) {
    }

    ngOnInit() {
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

        this.$cinemas.forEach(value => {
            this.map.addMarkerSync({
                title:value.name+"\n"+value.address,
                icon: '#8814b4',
                animation: 'DROP',
                position: {
                    lat: value.latitude,
                    lng: value.longitude
                }
            });
        });
    }
}
