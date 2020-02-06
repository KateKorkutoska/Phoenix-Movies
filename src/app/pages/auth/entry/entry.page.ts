import {Component, OnInit} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {ToastService} from '../../../services/Toast Controller/toast.service';

@Component({
    selector: 'app-entry',
    templateUrl: './entry.page.html',
    styleUrls: ['./entry.page.scss'],
})
export class EntryPage implements OnInit {

    constructor(private menuCtrl: MenuController,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.menuCtrl.enable(false);
    }

}
