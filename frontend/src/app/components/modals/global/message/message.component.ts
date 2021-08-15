import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface MessageData {
  title: string;
  message1: string;
  message2: string;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  constructor(private dialogRef: MatDialogRef<MessageComponent>,
  @Inject(MAT_DIALOG_DATA) public data: MessageData
  ) {}

  Confirm(): void {
    this.dialogRef.close(true);
  }

}
