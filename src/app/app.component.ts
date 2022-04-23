import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { OdooService } from './services/odoo.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public appPages = [
    { title: 'Events', url: '/events', icon: 'calendar' },
    { title: 'Profile', url: '/profile', icon: 'person' },
    { title: 'Info', url: '/info', icon: 'information' },
  ];
  constructor(private router: Router,
    private odooService: OdooService,
    private menu: MenuController) {
      
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
