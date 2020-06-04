import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlanningItem } from '../classes/planning-item';
import * as moment from 'moment';
import { Engineer } from '../classes/engineer';
import { WorkItem } from '../classes/work-item';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  public colDefs = [
    {
      headerName: 'Werkorder',
      children: [
        { headerName: 'Klantteam', field: '_embedded.workitem.administration', sort: 'asc', pinned: 'left', width: 280 },
        { headerName: 'B-nummer', field: '_embedded.workitem.l2_guid', pinned: 'left', width: 150 },
        { headerName: 'Volgnummer', field: '_embedded.workitem.sub_order_id', pinned: 'left', width: 150 },
        { headerName: 'Categorie', field: '_embedded.workitem.category', pinned: 'left', width: 100 },
      ]
    },
    {
      headerName: 'Adres',
      children: [
        { headerName: 'Plaats', field: '_embedded.workitem.city' },
        { headerName: 'Postcode', field: '_embedded.workitem.zip' },
        { headerName: 'Straat', field: '_embedded.workitem.street' }
      ]
    },
    {
      headerName: 'Werknemer',
      children: [
        { headerName: 'Naam', field: '_embedded.engineer.name' },
        { headerName: 'Nummer', field: '_embedded.engineer.employee_number', hide: true },
      ]
    },
    {
      headerName: 'Rooster',
      children: [
        {
          headerName: 'Starttijd',
          field: '_embedded.workitem.start_timestamp',
          cellRenderer: (data): string => {
            const date = moment(data.value);
            return date.isValid() ? date.format('DD/MM/YYYY HH:mm') : '-';
          }
        },
        {
          headerName: 'Eindtijd',
          field: '_embedded.workitem.end_timestamp',
          cellRenderer: (data): string => {
            const date = moment(data.value);
            return date.isValid() ? date.format('DD/MM/YYYY HH:mm') : '-';
          }
        },
      ]
    },
  ];

  constructor(
    private apiService: ApiService,
  ) { }

  getPlanning(): Observable<any> {
    return this.apiService.apiGet('/plannings')
      .pipe(
        map((res: any) => {
          return {
            planning: res.items.map(item => PlanningItem.fromRaw(item)),
            unplannedEngineers: res.unplanned_engineers.map(item => Engineer.fromRaw(item)),
            unplannedWorkitems: res.unplanned_workitems.map(item => WorkItem.fromRaw(item)),
          };
        }),
      );
  }
}

