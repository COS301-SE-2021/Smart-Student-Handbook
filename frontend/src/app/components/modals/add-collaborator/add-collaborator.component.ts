import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import algoliasearch from 'algoliasearch/lite';

export interface CollaboratorData {
	name: string;
	profileUrl?: string;
	id: string;
}

const searchClient = algoliasearch(
	'AD2K8AK74A',
	'589f047ba9ac7fa58796f394427d7f35'
);

@Component({
	selector: 'app-add-collaborator',
	templateUrl: './add-collaborator.component.html',
	styleUrls: ['./add-collaborator.component.scss'],
})
export class AddCollaboratorComponent {
	myControl = new FormControl();

	config = {
		apiKey: '589f047ba9ac7fa58796f394427d7f35',
		appId: 'AD2K8AK74A',
		indexName: 'users',
		routing: true,
		searchClient,
	};

	selectedUser?: any;

	constructor(
		public dialogRef: MatDialogRef<AddCollaboratorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: CollaboratorData
	) {}

	onNoClick(): void {
		this.dialogRef.close();
	}

	select(user: any): void {
		this.selectedUser = {
			name: user.data.username,
			profileUrl: user.data.profilePicUrl,
			id: user.data.uid,
		};

		this.dialogRef.close(this.selectedUser);
	}
}
