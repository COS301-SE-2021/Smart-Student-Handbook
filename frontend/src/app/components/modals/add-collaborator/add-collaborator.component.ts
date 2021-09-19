import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import algoliasearch from 'algoliasearch/lite';
import { NotificationService } from '@app/services';

export interface CollaboratorData {
	name: string;
	profileUrl?: string;
	id: string;
	senderId: string;
	notebookID: string;
	notebookTitle: string;
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
export class AddCollaboratorComponent implements OnInit {
	myControl = new FormControl();

	senderId: string;

	notebookID: string;

	notebookTitle: string;

	doneLoading: boolean = true;

	config = {
		apiKey: '589f047ba9ac7fa58796f394427d7f35',
		appId: 'AD2K8AK74A',
		indexName: 'users',
		routing: true,
		searchClient,
	};

	selectedUser?: any;

	@ViewChild('collaborators') collaborators: HTMLDivElement;

	constructor(
		public dialogRef: MatDialogRef<AddCollaboratorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: CollaboratorData,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.senderId = this.data.senderId;
		this.notebookID = this.data.notebookID;
		this.notebookTitle = this.data.notebookTitle;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	select(user: any, collaborators: any, index: number): void {
		this.selectedUser = {
			name: user.data.username,
			profileUrl: user.data.profilePicUrl,
			id: user.data.uid,
		};

		const prevCollaborators: HTMLCollection = collaborators.children;

		for (let i = 0; i < prevCollaborators.length; i += 1) {
			const c = prevCollaborators[i];

			if (c.attributes[2].value === 'border: 2px solid black;') {
				c.attributes[2].value = '';
			}
		}

		const collaborator = collaborators.children[index];

		collaborator.style.border = '2px solid black';
	}

	sendRequest() {
		this.doneLoading = false;

		this.notificationService
			.sendCollaborationRequest(
				this.senderId,
				this.selectedUser.id,
				this.notebookID,
				this.notebookTitle
			)
			.subscribe(
				() => {
					this.doneLoading = true;
					this.dialogRef.close(true);
				},
				() => {
					// observer.next(false);
				}
			);
	}
}
