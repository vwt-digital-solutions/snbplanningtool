import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import {AuthRoleService} from './auth-role.service';
import {ApiService} from './api.service';
import {ValueFilter} from '../modules/filters/filters/filters';
import {FilterMap} from '../modules/filters/filter-map';

@Injectable({
  providedIn: 'root'
})
export class WorkItemProviderService {

  rawWorkItems: any[]  = [];
  filteredWorkItems: any[] = [];
  workItemsFeatureCollection: any[] = [];

  workItemsSubject = new Subject<any[]>();
  mapWorkItemsSubject = new Subject<any[]>();
  loadingSubject = new Subject<boolean>();
  errorSubject  = new Subject<any>();

  public filterService = new FilterMap(
    [
      new ValueFilter('Stad', 'city', 'Utrecht'),
    ]
  );

  constructor(public authRoleService: AuthRoleService,
              private apiService: ApiService,
              ) {
    this.filterService.filterChanged.subscribe(value => {
      this.filterWorkItems();
      this.workItemsToFeatureCollection();
    });

    this.getWorkItems();
  }

  //
  private getWorkItems() {
    this.loadingSubject.next(true);

    this.apiService.apiGet('/workitems/all').subscribe(
      (result: any[]) => {
        this.rawWorkItems = result;

        this.filterWorkItems();
        this.workItemsToFeatureCollection();
        this.loadingSubject.next(false);
      },
      error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error);
      }
    );

  }

  private filterWorkItems() {
    this.filteredWorkItems = this.filterService.filterList(this.rawWorkItems);
    this.workItemsSubject.next(this.filteredWorkItems);
  }

  private workItemsToFeatureCollection() {
    const newWorkItemsFeatureCollection = [];

    for (const item in this.filteredWorkItems) {
      if (this.filteredWorkItems[item].geometry) {
        const newWorkItem = { type: 'Feature', geometry: { type: 'Point', coordinates: [] }, properties: {} };

        for (const property in this.filteredWorkItems[item]) {
          if (property !== 'geometry') {
            newWorkItem.properties[property] = this.filteredWorkItems[item][property];
          } else {
            newWorkItem.geometry.coordinates = this.filteredWorkItems[item][property].coordinates;
          }
        }
        (newWorkItem as any).layer = 'work';
        (newWorkItem as any).active = true;

        newWorkItemsFeatureCollection.push(newWorkItem);
      }
    }
    this.workItemsFeatureCollection = newWorkItemsFeatureCollection;
    this.mapWorkItemsSubject.next(this.workItemsFeatureCollection);

  }
}






