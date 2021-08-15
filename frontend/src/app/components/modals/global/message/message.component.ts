import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  constructor(private dialogRef: MatDialogRef<MessageComponent>) {}

  Confirm(): void {
    this.dialogRef.close(true);
  }

}
