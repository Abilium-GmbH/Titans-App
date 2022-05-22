import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { ColormatrixComponent } from './colormatrix.component';

@NgModule({
  declarations: [ColormatrixComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
  ],
  exports: [ColormatrixComponent]
})
export class ColormatrixComponentModule {}
