/* eslint-disable @typescript-eslint/camelcase */
import { BusinessUnit } from './business-unit';
import { HALSelfReference } from './HAL';

export class Engineer {
  id: string;
  token: string;
  name: string;
  role: string;
  employeeNumber: string;
  division: string;
  businessUnit: BusinessUnit;
  administration?: string;
  _links?: HALSelfReference;

  constructor(
    id: string,
    token: string,
    name: string,
    role: string,
    employeeNumber: string,
    division: string,
    businessUnit: BusinessUnit,
    administration?: string,
    _links?: HALSelfReference
  ) {
    this.id = id;
    this.token = token;
    this.name = name;
    this.employeeNumber = employeeNumber;
    this.role = role;
    this.businessUnit = businessUnit;
    this.division = division;
    this.administration = administration;
    this._links = _links;
  }

  public static fromRaw(item): Engineer {
    return new Engineer(
      item.id,
      item.token,
      item.name,
      item.role,
      item.driver_employee_number,
      item.division,
      item.business_unit,
      item.administration,
      item._links
    );
  }

  public static toRaw(engineer: Engineer): object {
    const item = {
      id: engineer.id,
      name : engineer.name,
      role : engineer.role,
      employee_number : engineer.employeeNumber,
      business_unit : engineer.businessUnit,
      administration : engineer.administration,
      token: engineer.token
    };

    return item;
  }
}
