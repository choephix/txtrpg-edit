import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-vew',
  templateUrl: './editor-vew.component.html',
  styleUrls: ['./editor-vew.component.css']
})
export class EditorVewComponent implements OnInit
{
  columnDefs = [
      { editable:true, field: 'make' , headerName: 'Make' },
      { editable:true, field: 'model', headerName: 'Model' },
      { editable:true, field: 'price', headerName: 'Price' }
  ];

  rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];

  constructor() { }

  ngOnInit() {
  }

}
