export class WorkClass {
  constructor(
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
    public l2_guid: string
  ) {}
}
