import * as L from 'leaflet';
import {MapGeometryObject} from '../../classes/map-geometry-object';

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

  public createMarker(item: MapGeometryObject) {
    const marker = item.getMarker();

    if (!marker) {
      return null;
    }

    marker.on({
      mouseover: () => {

        const component = this.resolver.resolveComponentFactory(item.getComponentClass()).create(this.injector);
        component.instance.properties = item;
        component.changeDetectorRef.detectChanges();

        marker.bindPopup(component.location.nativeElement, {
          ...item.getPopupOptions(),
          className: 'leaflet-custom-popup'
        });

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

        throw Error('Throwing an error to prevent popup from closing again');
      },
    });

    return marker;
  }

  ////
  // Icons
  ////

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

}
