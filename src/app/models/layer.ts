import {MapGeometryObject} from '../classes/map-geometry-object';

export type Layer = 'cars' | 'work';

export class CustomLayer {
  constructor(
    public title: string,
    public items: MapGeometryObject[]
  ) {}
}
