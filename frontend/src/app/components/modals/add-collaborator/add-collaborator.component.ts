import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
export class AddCollaboratorComponent implements OnInit {
	myControl = new FormControl();

	config = {
		apiKey: '589f047ba9ac7fa58796f394427d7f35',
		appId: 'AD2K8AK74A',
		indexName: 'users',
		routing: true,
		searchClient,
	};

	options: CollaboratorData[] = [
		{ name: 'Arno', profileUrl: '', id: 'gRX5LNVNIcUgK0R8qC2DSHFZ5My2' },
	];

	selectedUser?: CollaboratorData;

	filteredOptions!: Observable<CollaboratorData[]>;

	constructor(
		public dialogRef: MatDialogRef<AddCollaboratorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: CollaboratorData
	) {}

	ngOnInit(): void {
		this.filteredOptions = this.myControl.valueChanges.pipe(
			startWith(''),
			map((value) => this.filter(value))
		);
	}

	private filter(value: string): CollaboratorData[] {
		const filterValue = value.toLowerCase();

		return this.options.filter((option) =>
			option.name.toLowerCase().includes(filterValue)
		);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	select(user: CollaboratorData): void {
		this.selectedUser = user;
	}
}
