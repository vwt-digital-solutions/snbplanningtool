import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {WorkItemProviderService} from '../../services/work-item-provider.service';
import { CarProviderService } from '../../services/car-provider.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  public workItemProviderService: WorkItemProviderService;
  public carProviderService: CarProviderService;

  constructor(
    workItemProviderService: WorkItemProviderService,
    carProviderService: CarProviderService
  ) {
    this.workItemProviderService = workItemProviderService;
    this.carProviderService = carProviderService;
  }

  ngOnInit() {
  }

}
