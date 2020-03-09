import * as L from 'leaflet';
import * as moment from 'moment';

export class Helpers {
  constructor(private mapService,
              private resolver,
              private injector) {
  }

  ////
  // Buttons
  ////

  public resetZoomButton(): L.Control {
    const control = new L.Control({position: 'bottomright'});
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

  public zoomButtons(): L.Control {
    const control = new L.Control({position: 'bottomright'});
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

  public hoverModeSwitch(): L.Control {
    const control = new L.Control({position: 'bottomright'});
    control.onAdd = () => {
      const hovermode = L.DomUtil.create('a', 'map-ui-element map-btn');
      const hovermodeEnabled = this.mapService.config.markerPopupOnHover;
      hovermode.innerHTML = `<i class="fas ${ hovermodeEnabled ? 'fa-eye' : 'fa-eye-slash'}"></i>`;

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

  ////
  // Markers
  ////

  public bindPopupToMarker(componentClass, feature, marker, options) {

    marker.on({
      mouseover: () => {

        const component = this.resolver.resolveComponentFactory(componentClass).create(this.injector);
        component.instance.properties = feature.properties;
        component.changeDetectorRef.detectChanges();

        marker.bindPopup(component.location.nativeElement, options);

        if (this.mapService.config.markerPopupOnHover && !this.mapService.clickedMarker) {
          marker.openPopup();
        }

      },
      mouseout: () => {
        if (this.mapService.config.markerPopupOnHover && !this.mapService.clickedMarker) {
          setTimeout(() => marker.closePopup(), 250);
        }
      },
      click: (event) => {
        this.mapService.clickedMarker = true;
        marker.openPopup();

        event.preventDefault();
      },
    });

    return marker;
  }

  public createWorkMarker(feature: any, options: any, coordinates: number[]): L.marker {
    const icon = this.getWorkIcon(feature, options);
    const marker = L.marker(L.latLng(coordinates[1], coordinates[0]), {
      ...options.marker,
      icon
    });

    return marker;
  }

  public createCarMarker(feature: any, options: any, coordinates: number[]): L.marker {
    const iconUrl = this.getIconPath('cars');
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

    return marker;
  }

  ////
  // Icons
  ////

  public getWorkIcon(feature: any, options: any): L.divIcon {
    const urgencyClass = this.featureUrgencyCSS(feature);
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
          <div style="background-image: url(${this.getIconPath('marker')})">
            <i class="glyph-icon fas ${categories[category.toLowerCase()]}"></i>
          </div>`,
        className: `div-icon work-marker ${urgencyClass}`,
        ...options.icon
      });
    } else {
      return new L.divIcon({
        html: `<div style="background-image: url(${this.getIconPath('work')})"></div>`,
        className: `div-icon work-marker ${urgencyClass}`,
        ...options.icon
      });
    }
  }

  public featureUrgencyCSS(feature: any): string {
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

  public createClusterIcon(cluster: any): L.divIcon {
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
      iconUrl: `/assets/images/clusters/m${size}.png`,
      className: `cluster size-${size}`,
      iconSize: iconSizes[size]
    });
  }

  public getIconPath(iconType?: string): string {
    let iconPath = '/assets/images';

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

}
