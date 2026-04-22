import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventDetailPageRoutingModule } from './event-detail-routing.module';

import { EventDetailPage } from './event-detail.page';
import { MapComponent } from '../map/map.component';
import { TranslateModule } from '@ngx-translate/core';
import { ColormatrixComponentModule } from '../colormatrix/colormatrix.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    EventDetailPageRoutingModule,
    ColormatrixComponentModule
  ],
  declarations: [EventDetailPage, MapComponent]
})
export class EventDetailPageModule {}
