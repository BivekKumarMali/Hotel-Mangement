import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  name: string;
  price: number;
  nod: number;
  constructor() { }

  ngOnInit(): void {
  }
  SaveFile() {
  }

}