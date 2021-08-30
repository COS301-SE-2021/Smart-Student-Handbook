import { Component, OnInit } from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';

const aa = require('search-insights');

const searchClient = algoliasearch(
	'AD2K8AK74A',
	'589f047ba9ac7fa58796f394427d7f35'
);
aa('init', {
	appId: 'AD2K8AK74A',
	apiKey: '589f047ba9ac7fa58796f394427d7f35',
});

@Component({
	selector: 'app-explore',
	templateUrl: './explore.component.html',
	styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
	config = {
		indexName: 'userNotebooks',
		searchClient,
		insightsClient: (window as any).aa,
	};

	private user: any;

	ngOnInit(): void {
		this.user = JSON.parse(<string>localStorage.getItem('user'));
		aa('setUserToken', this.user);
		aa('clickedObjectIDsAfterSearch', {
			index: 'userNotebooks',
			eventName: 'Click item',
			queryID: '43b15df305339e827f0ac0bdc5ebcaa7',
			objectIDs: ['oject'],
			positions: [42],
		});

		aa('onUserTokenChange', (userToken) => {
			console.log('userToken has changed: ', userToken);
		});
	}
}
