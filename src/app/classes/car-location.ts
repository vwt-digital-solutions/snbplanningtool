import {MapGeometryObject} from './map-geometry-object';
import {Car} from './car';
import {CarInfoPopupComponent} from '../components/map/popup/carinfo/car-info-popup.component';
import * as L from 'leaflet';

export default class CarLocation extends MapGeometryObject {
  public constructor(public car: Car, public token: string, geometry) {
    super(geometry);
  }

  layer = 'cars';

  getMarker() {
    const icon = this.getIcon();
    const marker = L.marker(L.latLng(this.geometry.coordinates[1], this.geometry.coordinates[0]), {
      ...this.options.marker,
      icon
    });

    return marker;
  }

  getIcon() {
    const iconUrl = this.getIconPath();
    let icon;

    if (this.car && this.car.driver_name) {
      icon = new L.divIcon({
        html: `
            <div style="background-image: url(${iconUrl})">
              <span>${ this.car.driver_name}</span>
            </div>
          `,
        className: 'div-icon',
        ...this.options.icon
      });
    } else {
      icon = new L.Icon({
        ...this.options.icon,
        iconUrl
      });
    }

    return icon;
  }

  getComponentClass() {
    return CarInfoPopupComponent;
  }

  getPopupOptions() {
    return {
      maxWidth: 300,
      minWidth: 200,
    };
  }

  protected getIconPath() {
    return this.iconPath + '/car-location.png';
  }




}
