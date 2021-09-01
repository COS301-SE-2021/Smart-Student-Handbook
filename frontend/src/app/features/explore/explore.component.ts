import { Component } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { NotebookObservablesService } from '@app/services';
import {
	ExploreNoteListBottomsheetComponent,
	ExploreNoteListComponent,
	RateNotebookComponent,
} from '@app/components';
import { MatDialog } from '@angular/material/dialog';
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

	hideNotes: boolean = true;

	hideReviews: boolean = true;

	title: string = '';

	constructor(
		private bottomSheet: MatBottomSheet,
		private dialog: MatDialog,
		private notebookObservables: NotebookObservablesService,
		private exploreObservables: ExploreObservablesService
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
			this.hideNotes = false;
			this.hideReviews = true;

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
		this.hideNotes = true;
		this.hideReviews = true;
	}

	openReviews(hit: any) {
		if (window.innerWidth <= 576) {
			this.bottomSheet.open(RateNotebookComponent);
		} else if (window.innerWidth <= 991) {
			this.dialog.open(RateNotebookComponent);
		} else {
			this.title = hit.data.title;

			this.hideNotes = true;
			this.hide = false;
			this.hideReviews = false;
		}

		this.notebookObservables.setReviewNotebook(hit.objectID);
	}
}
