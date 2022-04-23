import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OdooService } from '../services/odoo.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
 
    constructor(private injector: Injector, 
        private router: Router,
        public toastController: ToastController) {
        }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(req.url.indexOf("authenticate")>=0
            || req.url.indexOf("reset_password")>=0) {
            return next.handle(req);
        }
        console.log("request with token");

        const odooService = this.injector.get(OdooService);

        let params = req.params.toString();
        req = req.clone({params:  new HttpParams({fromString: params}).append("session_id", odooService.token)});
        return next.handle(req);
    }

}