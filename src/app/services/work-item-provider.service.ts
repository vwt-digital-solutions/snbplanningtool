import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import {AuthRoleService} from './auth-role.service';
import {ApiService} from './api.service';
import {
  BooleanFilter, ChoiceFilter, ChoiceFilterType, DateFilter,
  ValueFilter
} from '../modules/filters/filters/filters';
import {FilterMap} from '../modules/filters/filter-map';

@Injectable({
  providedIn: 'root'
})
export class WorkItemProviderService {

  rawWorkItems: any[]  = [];
  filteredWorkItems: any[] = [];
  workItemsFeatureCollection: any[] = [];
  loading = true;

  workItemsSubject = new BehaviorSubject<any[]>([]);
  mapWorkItemsSubject = new BehaviorSubject<any[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(true);
  errorSubject  = new Subject<any>();

  public filterService = new FilterMap(
    [
      new ValueFilter('Beschrijving', 'description'),
      new ChoiceFilter('Administratie (klantteam)', 'administration', ChoiceFilterType.multiple),
      new ChoiceFilter('Taaktype', 'task_type', ChoiceFilterType.multiple),
      new ChoiceFilter('Status', 'status', ChoiceFilterType.multiple),
      new DateFilter('Startdatum', 'start_timestamp'),
      new DateFilter('Einddatum', 'end_timestamp'),
      new ChoiceFilter('Categorie', 'category', ChoiceFilterType.multiple),
      new BooleanFilter('Stagnatie', 'stagnation'),
      new DateFilter('Uiterstehersteltijd', 'resolve_before_timestamp'),
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

    setInterval(() => {
      this.getWorkItems();
    }, (5 * 60 * 1000));
  }

  //
  private getWorkItems() {
    this.loading = true;
    this.loadingSubject.next(true);

    this.apiService.apiGet('/workitems').subscribe(
      (result: any[]) => {
        this.rawWorkItems = result;

        this.filterWorkItems();
        this.workItemsToFeatureCollection();
        this.loading = false;
        this.loadingSubject.next(false);
      },
      error => {
        this.loading = false;
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






