import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { OdooService } from '../services/odoo.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  @Input() eid: number;
  public data: any;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private odooService: OdooService,
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if(this.eid) {
      this.odooService.getEvent(this.eid).then(d => {
        this.data = d['result'];
        this.data.start_date = this.datePipe.transform(this.data.start, "EEEE, dd.MM.yyyy", null, this.translate.currentLang);
        this.data.end_date = this.datePipe.transform(this.data.stop, "EEEE, dd.MM.yyyy", null, this.translate.currentLang);
        this.data.durationHours = (new Date(this.data.stop).getTime() - new Date(this.data.start).getTime()) / 1000 / 3600;
        for(let g of this.data.groups) {
          g.hex = this.odooService.getHexColorForName(g.color);
        }
        /*this.data.partner_answers = [
          {answer: 'yes', name: 'Anna', trikot_num: 2},
          {answer: 'yes', name: 'Angelika', trikot_num: 44},
          {answer: 'no', name: 'Hans', trikot_num: 32},
          {answer: 'no', name: 'Anna', trikot_num: 12},
          {answer: '', name: 'Hannes', trikot_num: 11},
          {answer: null, name: 'Bert', trikot_num: 23},
      ]*/
        this.data.partner_answers.sort((a,b) => this.sortPartnerAnswers(a,b))
      }).catch(e => {
        this.alertCtrl.create({
          header: 'Error',
          message: 'Could not load event. Please try again, later.',
          buttons: [{
            text: 'Close',
            role: 'close'
          }]
        }).then(a => a.present());
      })
    }
  }

  sortPartnerAnswers(a,b) {
    let mappedAnswerA = this.mapAnswerToOrder(a.answer);
    let mappedAnswerB = this.mapAnswerToOrder(b.answer)
    if(mappedAnswerA > mappedAnswerB) {
      return 1;
    } else if(mappedAnswerA == mappedAnswerB) {
      return this.sortAlphabetically(a,b);
    } else {
      return -1;
    }
  }

  mapAnswerToOrder(answer) {
    if(answer == 'yes') {
      return -1;
    } else if(answer == 'no') {
      return 1;
    } else {
      return 0;
    }
  }

  sortAlphabetically(a,b) {
    if(a > b) {
      return 1;
    } else {
      return -1;
    }
  }

  close() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}