import { Component, Inject , OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-global-confirm',
  templateUrl: './global-confirm.component.html',
  styleUrls: ['./global-confirm.component.scss']
})
export class GlobalConfirmComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<GlobalConfirmComponent>) { }

  ngOnInit(): void {
  }

  Confirm(): void {
    this.dialogRef.close(true);
  }

  Cancel(): void {
    this.dialogRef.close(false);
  }

}
