import {MapGeometryObject} from './map-geometry-object';
import {WorkItemPopupComponent} from '../components/map/popup/workitem/work-item-popup.component';
import * as moment from 'moment';
import * as L from 'leaflet';

export class WorkItem extends MapGeometryObject {
  public static readonly categories = {
    bulkuitvoering: 'fa-pallet',
    netwerkkwaliteit: 'fa-signal',
    schade: 'fa-exclamation',
    storing: 'fa-unlink',
  };

  constructor(
    public administration: string,
    public category: string,
    public resolve_before_timestamp: string,
    public stagnation: boolean,
    public project: string,
    public city: string,
    public description: string,
    public employee_name: string,
    public employee_number: string,
    public end_timestamp: string,
    public geometry: any,
    public project_number: number,
    public start_timestamp: string,
    public status: string,
    public street: string,
    public task_type: string,
    public zip: string,
    public l2_guid: string
  ) {
    super(geometry);
  }

  getMarker() {
    if (!this.geometry || !this.geometry.coordinates) {
      return null;
    }
    const icon = this.getIcon();
    const marker = L.marker(L.latLng(this.geometry.coordinates[1], this.geometry.coordinates[0]), {
      ...this.options.marker,
      icon
    });

    return marker;
  }

  getIcon() {
    const urgencyClass = this.featureUrgencyCSS();
    const category = this.category;

    if (category && WorkItem.categories.hasOwnProperty(category.toLowerCase())) {
      return new L.divIcon({
        html: `
          <div style="background-image: url(${this.getIconPath(true)})">
            <i class="glyph-icon fas ${WorkItem.categories[category.toLowerCase()]}"></i>
          </div>`,
        className: `div-icon work-marker ${urgencyClass}`,
        ...this.options.icon
      });
    } else {
      return new L.divIcon({
        html: `<div style="background-image: url(${this.getIconPath()})"></div>`,
        className: `div-icon work-marker ${urgencyClass}`,
        ...this.options.icon
      });
    }
  }

  getComponentClass() {
    return WorkItemPopupComponent;
  }

  getPopupOptions() {
    return {
      maxWidth: 600,
      minWidth: 500,
    };
  }

  public featureUrgencyCSS(): string {
    const shouldResolveTime = this.resolve_before_timestamp;
    const then = moment(shouldResolveTime, moment.ISO_8601);

    if (this.status.toLowerCase() !== 'te plannen'.toLowerCase()) {
      return '';
    }

    if (then.isValid()) {
      if (moment().add(1, 'days').isBefore(then)) {
        return 'on-schedule';
      } else {
        return 'urgent';
      }
    }

    return '';
  }

  protected getIconPath(hasCategory= false) {
    if (hasCategory) {
      return this.iconPath + '/marker.png';
    }

    return this.iconPath + '/work-location.png';
  }
}
