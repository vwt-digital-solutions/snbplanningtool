import * as L from 'leaflet';

export abstract class MapGeometryObject {
  public static businessUnits = ['service', 'ftth', 'nls'];
  public static administrations = [
    'Administratie niet kunnen bepalen',
    'Operations Noord Klantteam 01 (NHL)',
    'Operations Noord Klantteam 02 (AMS)',
    'Operations Noord Klantteam 03 (UTR)',
    'Operations Noord Klantteam 04 (FRL)',
    'Operations Noord Klantteam 05 (GRN)',
    'Operations Noord Klantteam 06 (OVL)',
    'Operations Zuid Klantteam 07 (DHG)',
    'Operations Zuid Klantteam 08 (RTD)',
    'Operations Zuid Klantteam 09 (ZLD)',
    'Operations Zuid Klantteam 10 (NBR)',
    'Operations Zuid Klantteam 11 (ANH)',
    'Operations Zuid Klantteam 12 (LIM)',
    'VWT Control',
    'VWT NOC Planning',
    'VWT NOC Projectteam',
    'VWT NOC Servicedesk en Vergunningenbureau',
    'VWT NOC Werkvoorbereiding/Engineering',
    'VWT Operations Noord Algemeen',
    'VWT Operations Zuid Algemeen',
  ];

  constructor(public geometry) {}

  options = {
    marker: {
      keyboard: false,
    },
    icon: {
      iconSize: [32, 33],
      iconAnchor: [16, 33],
      popupAnchor: [0, 0]
    }
  };

  protected iconPath = '/assets/images';

  public abstract getMarker(): L.marker;
  public abstract getComponentClass();
  public abstract getPopupOptions();

  protected abstract getIcon(): L.divIcon;

  protected getIconPath(): string {
    return this.iconPath + '/marker.png';
  }
}
