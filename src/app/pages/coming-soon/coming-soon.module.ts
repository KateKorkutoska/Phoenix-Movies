import {NgModule} from '@angular/core';

import {IonicModule} from '@ionic/angular';

import {ComingSoonPageRoutingModule} from './coming-soon-routing.module';

import {ComingSoonPage} from './coming-soon.page';
import {SharedModule} from '../../shared/shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        IonicModule,
        ComingSoonPageRoutingModule
    ],
    declarations: [ComingSoonPage]
})
export class ComingSoonPageModule {
}
