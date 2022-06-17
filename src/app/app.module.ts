import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { OdooService } from './services/odoo.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { DatePipe, registerLocaleData } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';
import { ColormatrixComponent } from './colormatrix/colormatrix.component';
import { ColormatrixComponentModule } from './colormatrix/colormatrix.module';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

registerLocaleData(localeEn, 'en');
registerLocaleData(localeDe, 'de');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    ColormatrixComponentModule,
    AppRoutingModule, 
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  OdooService,  
  CookieService,
  DatePipe,
  StatusBar,
  { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true},
],
  bootstrap: [AppComponent],
})
export class AppModule {}
