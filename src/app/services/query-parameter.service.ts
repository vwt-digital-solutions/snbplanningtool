import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QueryParameterService {
  constructor(
    public route: ActivatedRoute,
    private router: Router
  ) {}

  public getRouteParams(url) {
    url = url.split('?').pop();
    const params = new URLSearchParams(url);
    const paramObj = {};

    params.forEach((value, key) => {
      if (paramObj.hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
        if (Array.isArray(paramObj[key])) {
          paramObj[key] = [...paramObj[key], value];
        } else {
          paramObj[key] = [paramObj[key], value];
        }
      } else {
        paramObj[key] = value;
      }
    });

    return paramObj;
  }

  public setRouteParams(queryParams: Params) {
    // The ['.'] is required otherwise the queryParams are not properly updated.
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams
    });
  }
}
