import { Component } from '@angular/core';
import {WorkItemProviderService} from '../../services/work-item-provider.service';
import { CarProviderService } from '../../services/car-provider.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {

  public workItemProviderService: WorkItemProviderService;
  public carProviderService: CarProviderService;

  constructor(
    workItemProviderService: WorkItemProviderService,
    carProviderService: CarProviderService
  ) {
    this.workItemProviderService = workItemProviderService;
    this.carProviderService = carProviderService;
  }

}
