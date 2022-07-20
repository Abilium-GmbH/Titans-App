import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EventDetailPage } from '../event-detail/event-detail.page';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, AfterViewInit {

  public events: any;

  constructor(private menu: MenuController, 
    private odooService: OdooService,
    private alertCtrl: AlertController,
    private datePipe: DatePipe,
    private translate: TranslateService,
    public modalCtrl: ModalController,
    private router: Router,
    private platform: Platform) {
      this.platform.backButton.subscribeWithPriority(1, () => {
        if(this.router.url.indexOf("events")>=0) {
          navigator['app'].exitApp();
        } else {
          this.router.navigate(['events']);
        }
      });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.menu.enable(true);

    this.doRefresh();
  }

  changeParticipation($event, eid) {
    this.odooService.setParticipation(eid, $event.detail.value).then(v => {
    }).catch(e => {
      this.alertCtrl.create({
        header: 'Error',
        message: 'Could not change participation. Please try again, later.',
        buttons: [{
          text: 'Close',
          role: 'close'
        }]
      }).then(a => a.present());
    });
  }

  stopPropagation($event) {
    $event.stopPropagation();
  }

  async showDetails(eid: number) {
    const modal = await this.modalCtrl.create({
      component: EventDetailPage,
      cssClass: 'event-detail',
      swipeToClose: true,
      presentingElement: await this.modalCtrl.getTop(),
      componentProps: {'eid': eid}
    });
    return await modal.present();
  }
  
  doRefresh($event = null) {
    this.odooService.getMyEvents().then(ev => {
      if($event) {
        $event.target.complete();
      }
      if('result' in ev) {
        let events = ev['result'];
        for(let e of events) {
          e.start_date_unix = new Date(e.start).getTime();
          if(e.start_date_unix < new Date().getTime()) {
            e.old_event = true;
          } else {
            e.old_event = false;
          }
          e.start_date = this.datePipe.transform(e.start, "EEEE, dd.MM.yyyy", null, this.translate.currentLang);
          e.colors = []
          for(let g of e.groups) {
            e.colors.push(this.odooService.getHexColorForName(g.color));
          }
        }
        this.events = events.sort((a,b) => (a.start_date_unix > b.start_date_unix) ? 1 : -1 );
      }
    });
  }
}
