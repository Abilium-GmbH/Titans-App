import { Component, Input, OnInit } from '@angular/core';

import * as esri from "esri-leaflet";
import { environment } from 'src/environments/environment';

declare const L:any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  private map: any;
  @Input() coordinates: [];
  streetLayer: any;

  constructor() { }

  ngOnInit() {
    this.initializeMap();

    let popup = L.popup();
        popup.setContent("<b>EVENT LOCATION</b><br/>");
        return L.marker(this.coordinates)
            .addTo(this.map)
            .bindPopup(popup);
  }

  initializeMap() {
    if(!this.map) {
        const apiKey = environment.esriKey;
    
        this.map = L.map('map', {
          minZoom: 8
        }).setView([46.818188,8.227512], 8);
    
        this.streetLayer = esri.basemapLayer("Streets", {
          apiKey: apiKey
        }).addTo(this.map);

        /*this.map.on('move', (event) => this.eventChangeFunc(event));
        this.map.on('click', (event) => this.eventClickMapFunc(event));*/
    } else {
        this.map.clearLayers();
    }
  }

}
