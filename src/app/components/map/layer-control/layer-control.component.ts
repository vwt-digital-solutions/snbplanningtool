import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-layer-control',
  templateUrl: './layer-control.component.html',
  styleUrls: ['./layer-control.component.scss']
})
export class LayerControlComponent {

  @Input() layers: any;
}
