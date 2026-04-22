import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotpwPageRoutingModule } from './forgotpw-routing.module';

import { ForgotpwPage } from './forgotpw.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    ForgotpwPageRoutingModule
  ],
  declarations: [ForgotpwPage]
})
export class ForgotpwPageModule {}
