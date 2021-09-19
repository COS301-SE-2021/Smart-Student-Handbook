import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-smart-assist-modal',
	templateUrl: './smart-assist-modal.component.html',
	styleUrls: ['./smart-assist-modal.component.scss'],
})
export class SmartAssistModalComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
