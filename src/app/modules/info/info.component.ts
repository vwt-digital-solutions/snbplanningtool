import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
@NgModule({
  imports: [
    CommonModule
  ]
})
export class InfoComponent implements OnInit {
  title: string = 'Car info';
}
