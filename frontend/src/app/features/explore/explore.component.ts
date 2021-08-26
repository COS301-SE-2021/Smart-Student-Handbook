import { Component, NgZone } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { NotebookService } from '@app/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

	constructor(
		private notebookService: NotebookService,
		private ngZone: NgZone
	) {}
}
