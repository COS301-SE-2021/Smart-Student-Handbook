import { Component } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
	'B1G2GM9NG0',
	'aadef574be1f9252bb48d4ea09b5cfe5'
);

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title: string = 'smart-student';

	config = {
		indexName: 'demo_ecommerce',
		searchClient,
	};
}
