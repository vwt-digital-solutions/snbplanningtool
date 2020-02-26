export class WorkClass {
  constructor(
    public administration: string,
    public category: string,
    public resolve_before_timestamp: string,
    public stagnation: boolean,
    public project: string,
    public city: string,
    public description: string,
    public employee_name: string,
    public end_timestamp: string,
    public geometry: object,
    public project_number: number,
    public start_timestamp: string,
    public status: string,
    public street: string,
    public task_type: string,
    public zip: string,
    public L2GUID: string
  ) {}
}
