import {MapGeometryObject} from '../classes/map-geometry-object';

export type Layer = 'cars' | 'work';

export class CustomLayer {
  constructor(
    public title: string,
    public items: MapGeometryObject[],
    public showRoute = false
  ) {}
}

export class ControlledLayer {

  public title: string;
  public identifier: string;
  public subGroup;
  public parentElement;

  public route;
  public routeParent;

  public visible = true;
  public removable = false;

  public onRemoveLayer: () => void;
  public onToggleLayer: (boolean) => void;
}
