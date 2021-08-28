import { Component, NgZone, OnInit } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { NotebookObservablesService, NotebookService } from '@app/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	AddNoteComponent,
	ExploreNoteListBottomsheetComponent,
	ExploreNotesEditorBottomSheetComponent,
	ExploreNotesEditorComponent,
} from '@app/components';
import { MatDialog } from '@angular/material/dialog';
import { ExploreNoteListComponent } from '@app/components/modals/explore-note-list/explore-note-list.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ExploreObservablesService } from '@app/services/notebook/observables/explore-observables.service';

const searchClient = algoliasearch(
	'AD2K8AK74A',
	'589f047ba9ac7fa58796f394427d7f35'
);
@Component({
	selector: 'app-explore',
	templateUrl: './explore.component.html',
	styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent {
	config = {
		apiKey: '589f047ba9ac7fa58796f394427d7f35',
		appId: 'AD2K8AK74A',
		indexName: 'userNotebooks',
		routing: true,
		searchClient,
		searchParameters: {
			hitsPerPage: 9,
		},
	};

	hide: boolean = true;

	title: string = '';

	constructor(
		private bottomSheet: MatBottomSheet,
		private dialog: MatDialog,
		private notebookService: NotebookService,
		private notebookObservables: NotebookObservablesService,
		private exploreObservables: ExploreObservablesService,
		private ngZone: NgZone
	) {}

	openNotes(hit: any) {
		if (window.innerWidth <= 576) {
			this.bottomSheet.open(ExploreNoteListBottomsheetComponent, {
				data: {
					title: hit.data.title,
				},
			});
		} else if (window.innerWidth <= 991) {
			this.dialog.open(ExploreNoteListComponent, {
				data: {
					title: hit.data.title,
				},
			});
		} else {
			this.hide = false;

			this.title = hit.data.title;
		}

		this.exploreObservables.setOpenExploreNotebook(
			hit.objectID,
			hit.data.title,
			true
		);
	}

	closeNotes() {
		this.hide = true;
	}
}
