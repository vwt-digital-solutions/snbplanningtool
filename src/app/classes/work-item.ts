import { MapGeometryObject } from './map-geometry-object';
import { WorkItemPopupComponent } from '../components/map/popup/workitem/work-item-popup.component';
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
    public geometry,
    public project_number: number,
    public start_timestamp: string,
    public status: string,
    public street: string,
    public task_type: string,
    public zip: string,
    public l2_guid: string,
    public counter_id: string,
    public sub_order_id?: string
  ) {
    super(geometry);
  }

  static fromRaw(item): WorkItem {
    const bNumber = item.l2_guid || item.id.substring(0, item.id.indexOf('-')) || item.id;
    return new WorkItem(
      item.administration,
      item.category,
      item.resolve_before_timestamp,
      item.stagnation,
      item.project,
      item.city,
      item.description,
      item.employee_name,
      item.employee_number,
      item.end_timestamp,
      item.geometry,
      item.project_number,
      item.start_timestamp,
      item.status,
      item.street,
      item.task_type,
      item.zip,
      bNumber,
      item.counter_id,
      item.sub_order_id
    );
  }

  getMarker(): L.marker {
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

  getIcon(): L.divIcon {
    const urgencyClass = this.featureUrgencyCSS();
    const category = this.category;

    if (category && WorkItem.categories.hasOwnProperty(category.toLowerCase())) { // eslint-disable-line no-prototype-builtins
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

  getComponentClass(): typeof WorkItemPopupComponent {
    return WorkItemPopupComponent;
  }

  getPopupOptions(): object {
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

  protected getIconPath(hasCategory = false): string {
    if (hasCategory) {
      return this.iconPath + '/marker.png';
    }

    return this.iconPath + '/work-location.png';
  }

}
