import * as L from 'leaflet';

export abstract class MapGeometryObject {
  constructor(public geometry: any) {}

  options = {
    marker: {
      keyboard: false,
    },
    icon: {
      iconSize: [32, 33],
      iconAnchor: null,
      popupAnchor: [0, 0]
    }
  };

  protected iconPath = '/assets/images';

  public abstract getMarker(): L.marker;
  public abstract getComponentClass();
  public abstract getPopupOptions(): any;

  protected abstract getIcon(): L.divIcon;

  protected getIconPath() {
    return this.iconPath + '/marker.png';
  }
}
