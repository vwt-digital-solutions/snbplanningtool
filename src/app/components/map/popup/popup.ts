import {Component, Input, OnInit} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-pop-up',
  template: `
    <p>
      pop-up works!
    </p>
  `,
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {

  public properties;

  constructor() { }

  ngOnInit() {
  }

}
