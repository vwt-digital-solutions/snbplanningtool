import { Pipe, PipeTransform } from '@angular/core';

export function stringToLicensePlate(value: string): string {
  const results = value.toUpperCase().match(/\d+|[A-Z]+/g);

  if (results) {
    return results.join('-');
  } else {
    return  '';
  }
}
@Pipe({ name: 'formatLicensePlate' })
export class FormatLicensePlatePipe implements PipeTransform {
  transform(value: string): string {

    return stringToLicensePlate(value);
  }
}
