import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-colormatrix',
  templateUrl: './colormatrix.component.html',
  styleUrls: ['./colormatrix.component.scss'],
})
export class ColormatrixComponent implements OnInit {

  @Input() colors: string[];
  constructor() { }

  ngOnInit() {
  }

}
