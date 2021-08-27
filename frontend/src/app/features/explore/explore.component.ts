import { Component, OnInit } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import aa from 'search-insights';

const userToken = 'testToken'; // Get the user token (synchronously or asynchronously).
// The `insights` middleware receives a notification
// and attaches the `userToken` to search calls onwards.
aa('setUserToken', userToken);

const searchClient = algoliasearch(
	'AD2K8AK74A',
	'589f047ba9ac7fa58796f394427d7f35'
);

@Component({
	selector: 'app-explore',
	templateUrl: './explore.component.html',
	styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
	config = {
		apiKey: '589f047ba9ac7fa58796f394427d7f35',
		appId: 'AD2K8AK74A',
		indexName: 'userNotebooks',
		analytics: true,
		clickAnalytics: true,
		routing: true,
		searchClient,
		insightsClient: (window as any).aa,
		searchParameters: {
			hitsPerPage: 9,
		},
	};

	// constructor() {

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {}
}
