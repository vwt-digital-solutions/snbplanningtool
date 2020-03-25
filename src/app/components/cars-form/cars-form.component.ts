import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';

import { Car } from 'src/app/classes/car';

import { ApiService } from 'src/app/services/api.service';
import { CarsService } from 'src/app/services/cars.service';
import {CarProviderService} from '../../services/car-provider.service';
import { MapGeometryObject } from '../../classes/map-geometry-object';
import {Token} from '../../classes/token';

@Component({
  selector: 'app-cars-form',
  templateUrl: './cars-form.component.html',
  styleUrls: ['./cars-form.component.scss']
})
export class CarsFormComponent implements OnInit {
  title = 'Voeg een nieuwe auto toe';
  titleEmpty = 'Er zijn geen niet-toegewezen tokens, probeer het later opnieuw.';
  valueFormat = 'Inclusief streepjes (bv. <strong>99-XXX-9</strong> or <strong>9-XXX-99</strong>)';
  buttonSave = 'Opslaan';

  carsTokens: Token[];
  administrations = MapGeometryObject.administrations;

  model = new Car(null, '', '', '', '', '', null);

  constructor(
    private apiService: ApiService,
    private carsService: CarsService,
    private carProviderService: CarProviderService
  ) { }

  ngOnInit() {
    this.carsTokens = this.carProviderService.tokensSubject.value;

    this.carProviderService.tokensSubject.subscribe(value => {
      this.carsTokens = value;
    });
  }

  onSubmit() {

    delete this.model.id;

    this.buttonSave = 'Opslaan <i class="fas fa-sync-alt fa-spin"></i>';

    this.carProviderService.savingSubject.subscribe(loading => {
      if (!loading) {
        this.buttonSave = 'Opgeslagen <i class="fas fa-check"></i>';
        setTimeout(() => {
          this.carsService.isHidden = true;
        }, 2000);
      }
    });

    this.carProviderService.postCarInfo([this.model]);

  }

  private handleError(error) {
    return throwError('Er is een fout opgetreden, probeer het later opnieuw.');
  }
}
