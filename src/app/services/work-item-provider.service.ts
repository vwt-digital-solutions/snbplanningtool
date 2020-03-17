import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { AuthRoleService } from './auth-role.service';
import { ApiService } from './api.service';
import {
  BooleanFilter,
  ChoiceFilter,
  ChoiceFilterType,
  DateFilter,
  ValueFilter
} from '../modules/filters/filters/filters';
import {FilterMap} from '../modules/filters/filter-map';
import { QueryParameterService } from './query-parameter.service';
import { take } from 'rxjs/operators';
import {WorkItem} from '../classes/work-item';

@Injectable({
  providedIn: 'root'
})
export class WorkItemProviderService {

  rawWorkItems: any[]  = [];
  filteredWorkItems: any[] = [];
  loading = true;

  workItemsSubject = new BehaviorSubject<any[]>([]);
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
      new BooleanFilter('Stagnatie', 'stagnation', ''),
      new DateFilter('Uiterstehersteltijd', 'resolve_before_timestamp'),
    ]
  );

  constructor(
    public authRoleService: AuthRoleService,
    private apiService: ApiService,
    private queryParameterService: QueryParameterService
  ) {
    this.filterService.filterChanged.subscribe(value => {
      this.queryParameterService.setRouteParams(value);
      this.filterWorkItems();
    });

    this.getWorkItems();

    // Only take 2 subscriptions the initial empty route and the routeparams that are initialised later.
    this.queryParameterService.route.queryParams.pipe(take(2)).subscribe(params => {
      this.filterService.setFilterValues(params);
    });

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
        this.rawWorkItems = result.map(resultItem =>
          new WorkItem(
            resultItem.administration,
            resultItem.category,
            resultItem.resolve_before_timestamp,
            resultItem.stagnation,
            resultItem.project,
            resultItem.city,
            resultItem.description,
            resultItem.employee_name,
            resultItem.employee_number,
            resultItem.end_timestamp,
            resultItem.geometry,
            resultItem.project_number,
            resultItem.start_timestamp,
            resultItem.status,
            resultItem.street,
            resultItem.task_type,
            resultItem.zip,
            resultItem.l2_guid,
          ));

        this.filterWorkItems();
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
}






