import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsPageRoutingModule } from './events-routing.module';

import { EventsPage } from './events.page';
import { TranslateModule } from '@ngx-translate/core';
import { ColormatrixComponentModule } from '../colormatrix/colormatrix.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    EventsPageRoutingModule,
    ColormatrixComponentModule
  ],
  declarations: [EventsPage]
})
export class EventsPageModule {}
