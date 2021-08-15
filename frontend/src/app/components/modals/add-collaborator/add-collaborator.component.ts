import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CollaboratorData {
	name: string;
	profileUrl?: string;
	id: string;
}

@Component({
	selector: 'app-add-collaborator',
	templateUrl: './add-collaborator.component.html',
	styleUrls: ['./add-collaborator.component.scss'],
})
export class AddCollaboratorComponent implements OnInit {
	myControl = new FormControl();

	options: CollaboratorData[] = [
		{ name: 'Koos', profileUrl: '', id: 'zWR185YngYMuzSgxCqc9dESFoCv1' },
		{ name: 'Jan', profileUrl: '', id: 'zWR185YngYMuzSgxCqc9dESFoCv1' },
		{ name: 'Piet', profileUrl: '', id: 'zWR185YngYMuzSgxCqc9dESFoCv1' },
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
