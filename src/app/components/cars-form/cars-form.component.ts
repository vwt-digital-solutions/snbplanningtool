import { Component, OnInit } from '@angular/core';

import { Engineer } from 'src/app/classes/engineer';

import { CarsService } from 'src/app/services/cars.service';
import { CarProviderService } from '../../services/car-provider.service';
import { MapGeometryObject } from '../../classes/map-geometry-object';
import Token from '../../classes/token';

@Component({
  selector: 'app-cars-form',
  templateUrl: './cars-form.component.html',
  styleUrls: ['./cars-form.component.scss']
})
export class CarsFormComponent implements OnInit {
  title = 'Voeg een nieuwe auto toe';
  titleEmpty = 'Er zijn geen niet-toegewezen kentekens, probeer het later opnieuw.';
  buttonSave = 'Opslaan';

  carsTokens: Token[];
  administrations = MapGeometryObject.administrations;
  businessUnits = MapGeometryObject.businessUnits;

  model = new Engineer(null, '', '', '', '', '', null, '', null);

  constructor(
    private carsService: CarsService,
    private carProviderService: CarProviderService
  ) { }

  ngOnInit(): void {
    this.carsTokens = this.carProviderService.tokensSubject.value;

    this.carProviderService.tokensSubject.subscribe(value => {
      this.carsTokens = value;
    });
  }

  onSubmit(): void {
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
}
