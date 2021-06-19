import { Component, Inject , OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss']
})
export class GlobalErrorComponent implements OnInit {

  message = this.data.error;
  constructor(@Inject(MAT_DIALOG_DATA) private data: {error: any}) { }

  ngOnInit(): void {
  }

}