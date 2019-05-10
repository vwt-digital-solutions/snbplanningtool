import { ControlPosition } from '@agm/core/services/google-maps-types';

export class MapService {
  geoJsonObjectAll: any = {"features": [], "type":"FeatureCollection"};
  geoJsonObjectActive: any = {"features": [], "type":"FeatureCollection"};

  activeTokenId: string;

  refreshUpdate : number;
  refreshStatus : string = 'Auto refresh (5 min.)';
  refreshStatusClass : boolean = false;
  zoomLevel: number = 8;

  iconUrlCar: string = 'assets/images/car-location.png';
  iconUrlWork: string = 'assets/images/work-location.png';

  markerLayer = {
    cars: true,
    work: true
  }

  clusterUrl: string = 'assets/images/clusters/m';
  clusterStyles: Object = [{textColor:"#FFFFFF",url:"assets/images/clusters/m1.png",height:52,width:53,backgroundPosition:"0 -1px"},{textColor:"#FFFFFF",url:"assets/images/clusters/m2.png",height:55,width:56,backgroundPosition:"0 -1px"},{textColor:"#FFFFFF",url:"assets/images/clusters/m3.png",height:65,width:66,backgroundPosition:"0 -1px"},{textColor:"#FFFFFF",url:"assets/images/clusters/m4.png",height:77,width:78,backgroundPosition:"0 -1px"},{textColor:"#FFFFFF",url:"assets/images/clusters/m5.png",height:89,width:90,backgroundPosition:"0 -1px"}];

  lat: number = 52.155285;
  lng: number = 5.387219;
  minZoom: number = 7;

  rotateControlOptions: Object = {
    position: ControlPosition.LEFT_CENTER
  };

  styles = [{elementType:'geometry',stylers:[{color:'#cccccc'}]},{elementType:'labels.icon',stylers:[{visibility:'off'}]},{elementType:'labels.text.fill',stylers:[{color:'#000000'}]},{elementType:'labels.text.stroke',stylers:[{color:'#f5f5f5'}]},{featureType:'administrative',elementType:'geometry',stylers:[{visibility:'off'}]},{featureType:'administrative.country',elementType:'geometry.stroke',stylers:[{color:'#000000'},{visibility:'on'},{weight:0.5}]},{featureType:'administrative.land_parcel',stylers:[{visibility:'off'}]},{featureType:'administrative.land_parcel',elementType:'labels.text.fill',stylers:[{color:'#bdbdbd'}]},{featureType:'administrative.neighborhood',stylers:[{visibility:'off'}]},{featureType:'landscape.man_made',stylers:[{color:'#d3b091'}]},{featureType:'landscape.natural.terrain',stylers:[{color:'#b4b4b4'}]},{featureType:'poi',stylers:[{visibility:'off'}]},{featureType:'poi',elementType:'geometry',stylers:[{color:'#eeeeee'}]},{featureType:'poi',elementType:'labels.text.fill',stylers:[{color:'#757575'}]},{featureType:'poi.park',elementType:'geometry',stylers:[{color:'#a1c2af'}]},{featureType:'poi.park',elementType:'labels.text.fill',stylers:[{color:'#9e9e9e'}]},{featureType:'road',elementType:'geometry',stylers:[{color:'#d4d8d8'}]},{featureType:'road',elementType:'labels',stylers:[{visibility:'on'}]},{featureType:'road',elementType:'labels.icon',stylers:[{visibility:'on'}]},{featureType:'road.arterial',elementType:'labels.text.fill',stylers:[{color:'#000000'}]},{featureType:'road.highway',elementType:'geometry',stylers:[{color:'#ecf0f1'}]},{featureType:'road.highway',elementType:'labels.text.fill',stylers:[{color:'#000000'}]},{featureType:'road.local',elementType:'labels.text.fill',stylers:[{color:'#000000'}]},{featureType:'transit',stylers:[{visibility:'off'}]},{featureType:'transit.line',elementType:'geometry',stylers:[{color:'#e5e5e5'}]},{featureType:'transit.station',elementType:'geometry',stylers:[{color:'#eeeeee'}]},{featureType:'water',elementType:'geometry',stylers:[{color:'#cce7f0'}]},{featureType:'water',elementType:'labels.text',stylers:[{visibility:'off'}]},{featureType:'water',elementType:'labels.text.fill',stylers:[{color:'#9e9e9e'}]}];

  constructor() { }

  setMapMarkers(){
    let that = this;
    this.geoJsonObjectActive.features = [];
    this.geoJsonObjectAll.features.forEach(function(feature){
      if(feature.active){
        that.geoJsonObjectActive.features.push(feature);
      }
    });
  }
}
