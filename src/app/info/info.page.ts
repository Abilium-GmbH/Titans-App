import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(private router: Router,
    private platform: Platform) { 
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.router.navigate(['events']);
      });
    }

  ngOnInit() {
  }

}
