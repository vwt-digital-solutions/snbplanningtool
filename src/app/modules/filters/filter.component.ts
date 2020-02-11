import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {WorkItemProviderService} from '../../services/work-item-provider.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  constructor(
    private workItemProviderService: WorkItemProviderService
  ) {
    this.workItemProviderService = workItemProviderService;
  }

  ngOnInit() {
  }

}
