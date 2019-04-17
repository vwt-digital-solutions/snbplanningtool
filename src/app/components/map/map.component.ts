import { Component } from '@angular/core';
import { EnvService } from '../../services/env.service';
import { MapService } from '../../services/map.service';
import { LazyMapsAPILoaderConfigLiteral } from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  constructor(public mapService: MapService){}

  refreshStatusClasses() {
    return {
      small: true,
      error: this.mapService.refreshStatusClass
    }
  }

  styleFunc() {
    return ({
      icon: { url: 'assets/images/car-location.png' },
      editable: false,
      draggable: false,
      clickable: false
    });
  }
}

export class MapsConfig implements LazyMapsAPILoaderConfigLiteral{
  public apiKey: string
  constructor(env: EnvService) {
    this.apiKey = env.googleMapsKey
  }
}
