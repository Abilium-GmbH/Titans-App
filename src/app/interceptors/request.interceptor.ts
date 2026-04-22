import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OdooService } from '../services/odoo.service';
import { tap } from 'rxjs/operators';

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
        const odooService = this.injector.get(OdooService);
        const router = this.injector.get(Router);

        let params = req.params.toString();
        req = req.clone({params:  new HttpParams({fromString: params}).append("session_id", odooService.token)});
        return next.handle(req).pipe(tap(
            event => {
                if(event instanceof HttpResponse) {
                    if('error' in event.body) {
                        if(event.body.error.code == 100) {
                            odooService.logout();
                            router.navigate(['login']);
                        }
                    }
                }
            }));
    }

}