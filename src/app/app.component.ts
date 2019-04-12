import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvService } from './services/env.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  apiUrl: Object = {};
  data: any = {};

  lat: number = 52.155285;
  lng: number = 5.387219;
  styles = [{elementType:'geometry',stylers:[{color:'#cccccc'}]},{elementType:'labels.icon',stylers:[{visibility:'off'}]},{elementType:'labels.text.fill',stylers:[{color:'#000000'}]},{elementType:'labels.text.stroke',stylers:[{color:'#f5f5f5'}]},{featureType:'administrative',elementType:'geometry',stylers:[{visibility:'off'}]},{featureType:'administrative.country',elementType:'geometry.stroke',stylers:[{color:'#000000'},{visibility:'on'},{weight:0.5}]},{featureType:'administrative.land_parcel',stylers:[{visibility:'off'}]},{featureType:'administrative.land_parcel',elementType:'labels.text.fill',stylers:[{color:'#bdbdbd'}]},{featureType:'administrative.neighborhood',stylers:[{visibility:'off'}]},{featureType:'landscape.man_made',stylers:[{color:'#d3b091'}]},{featureType:'landscape.natural.terrain',stylers:[{color:'#b4b4b4'}]},{featureType:'poi',stylers:[{visibility:'off'}]},{featureType:'poi',elementType:'geometry',stylers:[{color:'#eeeeee'}]},{featureType:'poi',elementType:'labels.text.fill',stylers:[{color:'#757575'}]},{featureType:'poi.park',elementType:'geometry',stylers:[{color:'#a1c2af'}]},{featureType:'poi.park',elementType:'labels.text.fill',stylers:[{color:'#9e9e9e'}]},{featureType:'road',elementType:'geometry',stylers:[{color:'#d4d8d8'}]},{featureType:'road',elementType:'labels',stylers:[{visibility:'on'}]},{featureType:'road',elementType:'labels.icon',stylers:[{visibility:'on'}]},{featureType:'road.arterial',elementType:'labels.text.fill',stylers:[{color:'#000000'}]},{featureType:'road.highway',elementType:'geometry',stylers:[{color:'#ecf0f1'}]},{featureType:'road.highway',elementType:'labels.text.fill',stylers:[{color:'#000000'}]},{featureType:'road.local',elementType:'labels.text.fill',stylers:[{color:'#000000'}]},{featureType:'transit',stylers:[{visibility:'off'}]},{featureType:'transit.line',elementType:'geometry',stylers:[{color:'#e5e5e5'}]},{featureType:'transit.station',elementType:'geometry',stylers:[{color:'#eeeeee'}]},{featureType:'water',elementType:'geometry',stylers:[{color:'#cce7f0'}]},{featureType:'water',elementType:'labels.text',stylers:[{visibility:'off'}]},{featureType:'water',elementType:'labels.text.fill',stylers:[{color:'#9e9e9e'}]}];

  geoJsonObject: Object = {
    "features":[],
    "type":"FeatureCollection"
  };
  styleFunc() {
    return ({
      icon: { url: 'assets/images/car-location.png' },
      editable: false,
      draggable: false,
      clickable: false
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.log('An error has concurred');
    return throwError('Something bad happened; please try again later.');
  };

  constructor(private http: HttpClient, private env: EnvService){
    if(env.apiUrl){
      this.http.get(this.env.apiUrl +'/cars').pipe(
        catchError(this.handleError)
      ).subscribe(data => {
        console.log(data);
        this.geoJsonObject = data;
      });
    }
  }
}
