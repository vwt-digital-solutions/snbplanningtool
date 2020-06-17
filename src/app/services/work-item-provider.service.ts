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
import { FilterMap } from '../modules/filters/filter-map';
import { QueryParameterService } from './query-parameter.service';
import { take } from 'rxjs/operators';
import { WorkItem } from '../classes/work-item';

@Injectable({
  providedIn: 'root'
})
export class WorkItemProviderService {

  rawWorkItems: WorkItem[] = [];
  filteredWorkItems: WorkItem[] = [];
  loading = true;

  workItemsSubject = new BehaviorSubject<any[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(true);
  errorSubject = new Subject<any>();

  public filterService = new FilterMap(
    [
      new ValueFilter('work', 'Beschrijving', 'description'),
      new ChoiceFilter('work', 'Administratie (klantteam)', 'administration', ChoiceFilterType.multiple),
      new ChoiceFilter('work', 'Taaktype', 'task_type', ChoiceFilterType.multiple),
      new ChoiceFilter('work', 'Status', 'status', ChoiceFilterType.multiple),
      new DateFilter('work', 'Datum', 'start_timestamp'),
      new ChoiceFilter(
        'work',
        'Categorie',
        'category',
        ChoiceFilterType.multiple,
        null,
        null,
        WorkItem.categories
      ),
      new BooleanFilter('work', 'Stagnatie', 'stagnation', ''),
      new DateFilter('work', 'Uiterstehersteltijd', 'resolve_before_timestamp'),
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
  public getWorkItems(): void {
    this.loading = true;
    this.loadingSubject.next(true);

    this.apiService.apiGet('/workitems').subscribe(
      result => {
        this.rawWorkItems = result.items.map(item => {
            return this.createNewWorkItem(item);
        });

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

  private filterWorkItems(): void {
    this.filteredWorkItems = this.filterService.filterList(this.rawWorkItems);
    this.workItemsSubject.next(this.filteredWorkItems);
  }

  private createNewWorkItem(item, suborderId?: string): WorkItem {
    return new WorkItem(
      item.administration,
      item.category,
      item.resolve_before_timestamp,
      item.stagnation,
      item.project,
      item.city,
      item.description,
      item.employee_name,
      item.employee_number,
      item.end_timestamp,
      item.geometry,
      item.project_number,
      item.start_timestamp,
      item.status,
      item.street,
      item.task_type,
      item.zip,
      item.l2_guid,
      item.counter_id,
      item.sub_order_id
    );
  }
}






