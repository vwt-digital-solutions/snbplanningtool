import {MapGeometryObject} from './map-geometry-object';
import {Engineer} from './engineer';
import {CarInfoPopupComponent} from '../components/map/popup/carinfo/car-info-popup.component';
import * as L from 'leaflet';

export default class CarLocation extends MapGeometryObject {
  public constructor(public engineer: Engineer, public token: string, geometry) {
    super(geometry);
  }

  layer = 'cars';

  getMarker(): L.marker {
    const icon = this.getIcon();
    const marker = L.marker(L.latLng(this.geometry.coordinates[1], this.geometry.coordinates[0]), {
      ...this.options.marker,
      icon
    });

    return marker;
  }

  getIcon(): L.Icon | L.divIcon {
    const iconUrl = this.getIconPath();
    let icon;

    if (this.engineer && this.engineer.name) {
      icon = new L.divIcon({
        html: `
            <div style="background-image: url(${iconUrl})">
              <span>${ this.engineer.name}</span>
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

  getComponentClass(): typeof CarInfoPopupComponent {
    return CarInfoPopupComponent;
  }

  getPopupOptions(): object {
    return {
      maxWidth: 300,
      minWidth: 200,
    };
  }

  protected getIconPath(): string {
    return this.iconPath + '/car-location.png';
  }
}
