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

// algolia events sender
const aa = require('search-insights');

aa('init', {
	appId: 'AD2K8AK74A',
	apiKey: '589f047ba9ac7fa58796f394427d7f35',
});

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
		clickAnalytics: true,
		routing: true,
		searchClient,
		insightsClient: (window as any).aa,
		searchParameters: {
			hitsPerPage: 9,
			query: '',
		},
	};

	config2 = {
		apiKey: '589f047ba9ac7fa58796f394427d7f35',
		appId: 'AD2K8AK74A',
		indexName: 'userNotes',
		clickAnalytics: true,
		routing: true,
		searchClient,
		insightsClient: (window as any).aa,
	};

	hide: boolean = true;

	hideNotes: boolean = true;

	hideReviews: boolean = true;

	title: string = '';

	user: any = JSON.parse(<string>localStorage.getItem('user'));

	constructor(
		private bottomSheet: MatBottomSheet,
		private dialog: MatDialog,
		private notebookObservables: NotebookObservablesService,
		private exploreObservables: ExploreObservablesService
	) {}

	openNotes(hit: any ) {
		if (window.innerWidth <= 576) {
			this.bottomSheet.open(ExploreNoteListBottomsheetComponent, {
				data: {
					title: hit.data.title,
				},
			});
		} else if (window.innerWidth <= 991) {
			this.dialog.open(ExploreNoteListComponent, {
				width: '100%',
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

		/*aa('setUserToken', this.user.uid);
		console.log('Hello');
		console.log(index);
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
      positions: [index + 1],

		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			// eslint-disable-next-line no-underscore-dangle
			positions: [hit.__hitIndex + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotes',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotes',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotes',
			eventName: 'Check out',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotebook',
			eventName: 'Check out',
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotebook',
			eventName: 'Check out',
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotebook',
			eventName: 'Check out',
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			// eslint-disable-next-line no-underscore-dangle
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
      positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotebooks',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotebook',
			eventName: 'Check out',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotebook',
			eventName: 'Check out',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotebook',
			eventName: 'Check out',
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotebook',
			eventName: 'Check out',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		// Notes indexing strts here

		aa('clickedObjectIDs', {
			index: 'userNotes',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
      positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotes',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotes',
			eventName: 'Check out',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotes',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
      positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotes',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotes',
			eventName: 'Check out',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});
		aa('clickedObjectIDs', {
			index: 'userNotes',
			eventName: 'Click object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
			positions: [index + 1],
		});
		aa('viewedObjectIDs', {
			index: 'userNotes',
			eventName: 'View object',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});

		aa('convertedObjectIDsAfterSearch', {
			index: 'userNotes',
			eventName: 'Check out',
			// eslint-disable-next-line no-underscore-dangle
			queryID: hit.__queryID,
			objectIDs: [hit.objectID],
		});*/
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
