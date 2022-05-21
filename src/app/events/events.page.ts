import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
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
    public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.menu.enable(true);

    this.odooService.getMyEvents().then(ev => {
      if('result' in ev) {
        this.events = ev['result'];
        for(let e of this.events) {
          e.start_date = this.datePipe.transform(e.start, "EEEE, dd.MM.yyyy");
        }
      }
    });
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

}
