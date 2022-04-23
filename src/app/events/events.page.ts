import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
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
    private datePipe: DatePipe) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.menu.enable(true);

    this.odooService.getMyEvents().then(ev => {
      if('result' in ev) {
        this.events = ev['result'];
        for(let e of this.events) {
          e.start_date = this.datePipe.transform(e.start, "EEEE, dd.MM.yyyy");
          console.log(e);
        }
        console.log(this.events)
      }
    });
  }

  changeParticipation($event, eid) {
    console.log($event, eid);
    this.odooService.setParticipation(eid, $event.detail.value).then(v => {
      console.log(v);
    });
  }

}
