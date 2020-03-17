import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-layer-control',
  templateUrl: './layer-control.component.html',
  styleUrls: ['./layer-control.component.scss']
})
export class LayerControlComponent implements OnInit {

  @Input() layers: any;

  constructor() { }

  ngOnInit() {
  }

}
