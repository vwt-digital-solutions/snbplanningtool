import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { MapService } from './services/map.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private apiService: ApiService, private mapService: MapService){}

  ngOnInit(){
    this.apiService.getCars().subscribe(
      result => {
        this.handleResult(result);
        setInterval(() => {
          this.refreshData()
        }, (5 * 60 * 1000));
      },
      error => this.handleError(error)
    );
  }

  refreshData(){
    this.apiService.updateData().subscribe(
      result => this.handleResult(result),
      error => this.handleError(error)
    );
  }

  private handleResult(result) {
    this.mapService.geoJsonObject = result;
    this.mapService.refreshUpdate = Date.now();
  };

  private handleError(error) {
    this.mapService.refreshStatusClass = true;
    this.mapService.refreshStatus = 'An error has occurred';
    return throwError('Something bad happened, please try again later.');
  };
}
