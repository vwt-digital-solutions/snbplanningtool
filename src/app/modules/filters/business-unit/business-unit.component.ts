import { Component } from '@angular/core';
import { MapGeometryObject } from 'src/app/classes/map-geometry-object';
import { CarProviderService } from 'src/app/services/car-provider.service';
import { WorkItemProviderService } from 'src/app/services/work-item-provider.service';

@Component({
  selector: 'app-business-unit',
  templateUrl: './business-unit.component.html',
  styleUrls: ['./business-unit.component.scss']
})
export class BusinessUnitComponent {
  businessUnits: string[] = MapGeometryObject.businessUnits;
  selectedBusinessUnit: string = localStorage.getItem('businessUnit') || this.businessUnits[0];

  constructor(
    private carProviderService: CarProviderService,
    private workItemProviderService: WorkItemProviderService
  ) { }

  setSelectedBusinessUnit(value: string): void {
    this.selectedBusinessUnit = value;
    localStorage.setItem('businessUnit', value);
    this.clearOldCache();
    this.renewData();
  }

  clearOldCache() {
    localStorage.removeItem('carTokens');
    localStorage.removeItem('carInfo');
  }

  renewData() {
    this.carProviderService.getCars();
    this.carProviderService.getTokens();
    this.carProviderService.getCarLocations();
    this.workItemProviderService.getWorkItems();
  }
}
