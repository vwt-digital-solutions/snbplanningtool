import * as L from 'leaflet';
import * as moment from 'moment';
import { first } from 'rxjs/operators';

export class Helpers {
  constructor(private mapService) {}

  public hoverModeSwitch(): L.Control {
    const control = new L.Control({ position: 'bottomright' });
    control.onAdd = () => {
      const hovermode = L.DomUtil.create('a', 'map-ui-element map-btn');
      const hovermodeEnabled = this.mapService.config.markerPopupOnHover;
      hovermode.innerHTML = `
        <i class="fas ${ hovermodeEnabled ? 'fa-eye' : 'fa-eye-slash'}"></i>
      `;

      L.DomEvent
        .disableClickPropagation(hovermode)
        .addListener(hovermode, 'click', () => {
          if (this.mapService.config.markerPopupOnHover) {
            this.mapService.config.markerPopupOnHover = false;
            hovermode.innerHTML = '<i class="fas fa-eye-slash"></i>';
          } else {
            this.mapService.config.markerPopupOnHover = true;
            hovermode.innerHTML = '<i class="fas fa-eye"></i>';
          }
        }, hovermode);

      return hovermode;
    };
    return control;
  }

  public createWorkMarker(feature: any, options: any, coordinates: number[]): L.marker {
    const icon = Helpers.getWorkIcon(feature, options);
    const marker = L.marker(L.latLng(coordinates[1], coordinates[0]), {
      ...options.marker,
      icon
    });

    const popupOptions = {
      maxWidth: 600,
      minWidth: 400,
    };

    marker.bindPopup(Helpers.createWorkPopup(feature), popupOptions);

    marker.on({
      mouseover: () => {
        if (this.mapService.config.markerPopupOnHover && !this.mapService.clickedMarker) {
          marker.openPopup();
        }
      },
      mouseout: () => {
        if (this.mapService.config.markerPopupOnHover && !this.mapService.clickedMarker) {
          setTimeout(() => marker.closePopup(), 250);
        }
      },
      click: () => {
        this.mapService.clickedMarker = true;
        marker.openPopup();
      },
    });

    return marker;
  }

  // tslint:disable:member-ordering
  public static createClusterIcon(cluster: any): L.divIcon {
    const count = cluster.getChildCount();
    const size = (count + '').length;

    const iconSizes = {
      1: [52, 53],
      2: [55, 56],
      3: [65, 66],
      4: [77, 78],
      5: [89, 90]
    };

    return L.divIcon({
      html: count,
      iconUrl: `../../assets/images/clusters/m${size}.png`,
      className: `cluster size-${size}`,
      iconSize: iconSizes[size]
    });
  }

  public static getIconPath(iconType?: string): string {
    let iconPath = '../../../assets/images';

    switch (iconType) {
      case 'cars':
        iconPath += '/car-location.png';
        break;

      case 'work':
        iconPath += '/work-location.png';
        break;

      default:
        iconPath += '/marker.png';
    }

    return iconPath;
  }

  public static featureUrgencyCSS(feature: any): string {
    const shouldResolveTime = feature.properties.resolve_before_timestamp;
    const then = moment(shouldResolveTime, moment.ISO_8601);

    if (feature.properties.status.toLowerCase() !== 'te plannen'.toLowerCase()) {
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

  public static getWorkIcon(feature: any, options: any): L.divIcon {
    const urgencyClass = Helpers.featureUrgencyCSS(feature);
    const category = feature.properties.category;

    const categories = {
      bulkuitvoering: 'fa-pallet',
      netwerkkwaliteit: 'fa-signal',
      schade: 'fa-exclamation',
      storing: 'fa-unlink',
    };

    if (category && categories.hasOwnProperty(category.toLowerCase())) {
      return new L.divIcon({
        html: `
          <div style="background-image: url(${Helpers.getIconPath('marker')})">
            <i class="glyph-icon fas ${categories[category.toLowerCase()]}"></i>
          </div>`,
        className: `div-icon work-marker ${urgencyClass}`,
        ...options.icon
      });
    } else {
      return new L.divIcon({
        html: `<div style="background-image: url(${Helpers.getIconPath('work')})"></div>`,
        className: `div-icon work-marker ${urgencyClass}`,
        ...options.icon
      });
    }
  }

  public static createCarMarker(feature: any, options: any, coordinates: number[]): L.marker {
    const iconUrl = Helpers.getIconPath('cars');
    let icon;

    if (feature.properties && feature.properties.driver_name) {
      icon = new L.divIcon({
        html: `
            <div style="background-image: url(${iconUrl})">
              <span>${ feature.properties.driver_name}</span>
            </div>
          `,
        className: 'div-icon',
        ...options.icon
      });
    } else {
      icon = new L.Icon({
        ...options.icon,
        iconUrl
      });
    }

    const marker = L.marker(L.latLng(coordinates[1], coordinates[0]), {
      ...options.marker,
      icon
    });

    const popupOptions = {
      maxWidth: 300,
      minWidth: 200,
    };
    marker.bindPopup(Helpers.createCarPopup(feature), popupOptions);

    return marker;
  }

  public static resetZoomButton(): L.Control {
    const control = new L.Control({ position: 'bottomright' });
    control.onAdd = (map: L.map) => {
      const resetZoom = L.DomUtil.create('a', 'map-ui-element map-btn');
      resetZoom.innerHTML = '<i class="fas fa-home"></i>';

      L.DomEvent
        .disableClickPropagation(resetZoom)
        .addListener(resetZoom, 'click', () => {
          map.setView(map.options.center, map.options.zoom);
        }, resetZoom);
      return resetZoom;
    };
    return control;
  }

  public static zoomButtons(): L.Control {
    const control = new L.Control({ position: 'bottomright' });
    control.onAdd = (map: L.map) => {
      const wrapper = L.DomUtil.create('div', 'map-ui-element zoom-btns');
      const zoomIn = L.DomUtil.create('div', 'map-btn');
      const zoomOut = L.DomUtil.create('div', 'map-btn');
      zoomIn.innerHTML = '<i class="fas fa-plus"></i>';
      zoomOut.innerHTML = '<i class="fas fa-minus"></i>';

      L.DomEvent.disableClickPropagation(wrapper);

      L.DomEvent.addListener(zoomIn, 'click', () => {
        map.setZoom(map.getZoom() + 1);
      }, zoomIn);
      L.DomEvent.addListener(zoomOut, 'click', () => {
        map.setZoom(map.getZoom() - 1);
      }, zoomOut);

      wrapper.appendChild(zoomIn);
      wrapper.appendChild(zoomOut);

      return wrapper;
    };
    return control;
  }

  public static createCarPopup(feature): string {
    return `
        <div class="row popup-car">
          <div class="col-12 item driver_name">
            <p>Naam bestuurder</p>
            <span>${feature.properties.driver_name || '-'}</span>
          </div>
          <div class="col-12 item driver_skill">
            <p>Rol bestuurder</p>
            <span>${feature.properties.driver_skill || '-'}</span>
          </div>
          <div class="col-12 item driver_employee_number">
            <p>Medewerkernr. bestuurder</p>
            <span>${feature.properties.driver_employee_number || '-'}</span>
          </div>
          <div class="col-12 item license_plate">
            <p>Kentekenplaat</p>
            <div class="license-plate license-nl">
              <span>${feature.properties.license_plate || 'N/B'}</span>
            </div>
          </div>
        </div>`;
  }

  public static createWorkPopup(feature): string {
    const properties = feature.properties;
    let start_time = null;
    let end_time = null;
    let resolve_before_time = null;
    let html = [
      `<div class="row popup-work no-gutters">`,
      `<div class="col-12 marker-work-inner">`
    ];

    if ('start_timestamp' in properties) {
      const momentDate = moment(properties.start_timestamp);
      start_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), momentDate.format('HH:mm')] : '-';
    }

    if ('end_timestamp' in properties) {
      const momentDate = moment(properties.end_timestamp);
      end_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), momentDate.format('HH:mm')] : '-';
    }

    if ('end_timestamp' in properties) {
      const momentDate = moment(properties.resolve_before_timestamp);
      resolve_before_time = momentDate.isValid() ? [momentDate.format('DD-MM-YYYY'), momentDate.format('HH:mm') ] : '-';
    }

    html.push(`
      <div class="row">
        <div class="col-6 item administration">
          <p>Administratie</p>
          <span> ${properties.administration || '-'}</span>
        </div>
        <div class="col-6 item task_type">
          <p>Taaktype</p>
          <span> ${properties.task_type || '-'}</span>
        </div>
        <div class="col-6 item project">
          <p>Project</p>
          <span> ${properties.project || '-'}</span>
        </div>
        <div class="col-6 item project_number">
          <p>Projectnummer</p>
          <span> ${properties.project_number || '-'}</span>
        </div>
        <div class="col-4 item category">
          <p>Categorie</p>
          <span> ${properties.category || '-'}</span>
        </div>
        <div class="col-4 item status">
          <p>Status</p>
          <span> ${properties.status || '-'}</span>
        </div>
        <div class="col-4 item stagnation">
          <p>Stagnatie</p>
          <span> ${properties.stagnation ? 'Ja' : 'Nee'}</span>
        </div>
      </div>

      <div class="row">
        <div class="col-6 item description">
          <p>Beschrijving</p>
          <span> ${properties.description || '-'}</span>
        </div>
        <div class="col-6 item description">
          <p>Uiterste hersteltijd</p>
          <span> ${ resolve_before_time[0] || '-'}</span>
          <span> ${ resolve_before_time[1] || '-'}</span>
        </div>
      </div>

      <div class="row">
        <div class="col-6 item date">
          <p>Startdatum</p>
          <span> ${ start_time[0] || '-'}</span>
          <span> ${ start_time[1] || '-'}</span>
        </div>
        <div class="col-6 item date">
          <p>Einddatum</p>
          <span> ${ end_time[0] || '-'}</span>
          <span> ${ end_time[1] || '-'}</span>
        </div>
      </div>`);

    if (properties.city || properties.zip || properties.street) {
      const locationProperties = ['<div class="row">'];

      // If exists add street
      if (properties.street) {
        locationProperties.push(`
            <div class="col-6 item street">
              <p>Straat</p>
              <span> ${properties.street} ${properties.house || ''} ${properties.extra || ''}</span>
            </div>`);
      }

      // If exists add zip
      if (properties.zip) {
        locationProperties.push(`
            <div class="col-3 item zip">
              <p>Postcode</p>
              <span> ${properties.zip}</span>
            </div>`);
      }

      // Add city
      locationProperties.push(`
          <div class="col-3 item city">
            <p>Plaats</p>
            <span> ${properties.city || 'N/B'}</span>
          </div>`);

      locationProperties.push('</div>');

      // If exists add employee name
      if (properties.employee_name) {
        locationProperties.push(`
          <div class="row">
            <div class="col-12 item employee_name">
              <p>Naam werknemer</p>
              <span> ${properties.employee_name}</span>
            </div>
          </div>`);
      }

      html = html.concat(locationProperties);
    }

    html.push('</div></div>');
    return html.join('');
  }
}
