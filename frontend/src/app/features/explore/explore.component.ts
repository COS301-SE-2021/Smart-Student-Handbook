import { Component, NgZone, OnInit } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { NotebookObservablesService, NotebookService } from '@app/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddNoteComponent, ExploreNotesComponent } from '@app/components';
import { MatDialog } from '@angular/material/dialog';
import { ExploreNoteListComponent } from '@app/components/modals/explore-note-list/explore-note-list.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

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

	title: string = '';

	constructor(
		private bottomSheet: MatBottomSheet,
		private dialog: MatDialog,
		private notebookService: NotebookService,
		private notebookObservables: NotebookObservablesService,
		private ngZone: NgZone
	) {}

	openNotes(hit: any) {
		if (window.innerWidth <= 991) {
			this.bottomSheet.open(ExploreNoteListComponent, {
				data: {
					title: hit.data.title,
				},
			});
		} else {
			const notesDiv = document.getElementById(
				'notesSideDiv'
			) as HTMLDivElement;
			notesDiv.classList.remove('notesHidden');
			notesDiv.classList.remove('col-0');
			notesDiv.classList.add('col-6');
			notesDiv.classList.add('notesDisplayed');

			const notesBoxShadow = document.getElementById(
				'notebookNotesContainer'
			) as HTMLDivElement;
			notesBoxShadow.classList.add('boxShadow');

			const closeNotesPanelBtn = document.getElementById(
				'closeNotesPanelBtn'
			) as HTMLDivElement;
			closeNotesPanelBtn.classList.remove('hidden');

			const notesHeading = document.getElementById(
				'notesHeading'
			) as HTMLDivElement;
			notesHeading.classList.remove('hidden');

			const noteCardsComponent = document.getElementById(
				'noteCardsComponent'
			) as HTMLDivElement;
			noteCardsComponent.classList.remove('hidden');

			this.title = hit.data.title;
		}

		this.notebookObservables.setOpenNotebook(
			hit.objectID,
			hit.data.title,
			true
		);
	}

	closeNotes() {
		const notesDiv = document.getElementById(
			'notesSideDiv'
		) as HTMLDivElement;
		notesDiv.classList.add('notesHidden');
		notesDiv.classList.add('col-0');
		notesDiv.classList.remove('col-6');
		notesDiv.classList.remove('notesDisplayed');

		const notesBoxShadow = document.getElementById(
			'notebookNotesContainer'
		) as HTMLDivElement;
		notesBoxShadow.classList.remove('boxShadow');

		const closeNotesPanelBtn = document.getElementById(
			'closeNotesPanelBtn'
		) as HTMLDivElement;
		closeNotesPanelBtn.classList.add('hidden');

		const notesHeading = document.getElementById(
			'notesHeading'
		) as HTMLDivElement;
		notesHeading.classList.add('hidden');

		const noteCardsComponent = document.getElementById(
			'noteCardsComponent'
		) as HTMLDivElement;
		noteCardsComponent.classList.add('hidden');
	}
}
