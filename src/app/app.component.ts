import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { OdooService } from './services/odoo.service';
import { StatusBar, Style } from '@capacitor/status-bar';

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

  constructor(
    private router: Router,
    private odooService: OdooService,
    private menu: MenuController,
    private platform: Platform,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang(environment.DEFAULT_LANGUAGE);
    this.setBrowserLanguage();
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(async () => {
      if (this.platform.is('hybrid')) {
        // Prüft, ob das System gerade im Dark Mode ist
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        await StatusBar.setStyle({
          style: isDark ? Style.Dark : Style.Light
        });

        // Optional: Hintergrundfarbe anpassen (Schwarz für Dark, Weiß für Light)
        await StatusBar.setBackgroundColor({
          color: isDark ? '#000000' : '#ffffff'
        });
      }
    });
  }

  setBrowserLanguage() {
    this.translate.use(window.navigator.language.substring(0, 2));
  }

  ngAfterViewInit(): void {
    this.menu.enable(false);
    if (!this.odooService.checkTokenAvailableAndNotExpired()) {
      this.logout();
    }
  }

  public logout() {
    this.menu.enable(false);
    this.odooService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}