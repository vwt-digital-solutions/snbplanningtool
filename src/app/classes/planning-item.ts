import { WorkItem } from './work-item';
import { Engineer } from './engineer';

export class PlanningItem {
  _embedded: {
    engineer: Engineer;
    workitem: WorkItem;
  };

  constructor(
    engineer: Engineer,
    workitem: WorkItem
  ) {
    this._embedded = {
      engineer: Engineer.fromRaw(engineer),
      workitem: WorkItem.fromRaw(workitem)
    };
}

  public static fromRaw(item): PlanningItem {
    return new PlanningItem(
      item._embedded.engineer,
      item._embedded.workitem
    );
  }
}
