import { BusinessUnit } from './business-unit';
import { HALSelfReference } from './HAL';

export class Engineer {
  id: string;
  name: string;
  skill: string;
  employee_number: string;
  division: string;
  business_unit: BusinessUnit;
  administration?: string;
  _links?: HALSelfReference;

  constructor(
    id: string,
    name: string,
    skill: string,
    employee_number: string,
    division: string,
    business_unit: BusinessUnit,
    administration?: string,
    _links?: HALSelfReference
  ) {
    this.id = id;
    this.name = name;
    this.employee_number = employee_number;
    this.skill = skill;
    this.business_unit = business_unit;
    this.division = division;
    this.administration = administration;
    this._links = _links;
  }

  public static fromRaw(item: any) {
    return new Engineer(
      item.id,
      item.driver_name, // !TODO: Migrate to name
      item.driver_skill, // !TODO: Migrate to skill
      item.driver_employee_number, // !TODO: Migrate to employee_number
      item.division,
      item.business_unit,
      item.administration,
      item._links
    );
  }
}
