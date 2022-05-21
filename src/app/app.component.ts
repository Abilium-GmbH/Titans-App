import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { OdooService } from './services/odoo.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public appPages = [
    { title: 'app.events', url: '/events', icon: 'calendar' },
    { title: 'app.profile', url: '/profile', icon: 'person' },
    { title: 'app.info', url: '/info', icon: 'information' },
  ];
  constructor(private router: Router,
    private odooService: OdooService,
    private menu: MenuController,
    private translate: TranslateService) {

      translate.setDefaultLang(environment.DEFAULT_LANGUAGE);
      this.setBrowserLanguage();
    }

  setBrowserLanguage() {
    this.translate.use(window.navigator.language.substring(0,2)); // default browser language
  }

  ngAfterViewInit(): void {
    this.menu.enable(false);
    this.odooService.checkTokenAvailableAndNotExpired();
  }

  public logout() {
    this.menu.enable(false);
    this.odooService.logout();
    this.router.navigate(['/login'], {replaceUrl: true})
  }
}
