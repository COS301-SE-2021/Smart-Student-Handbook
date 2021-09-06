import { Component } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { Title } from '@angular/platform-browser';

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
	title: string = 'Smart Student Handbook';

	constructor(private titleService: Title) {
		this.titleService.setTitle(this.title);
	}

	config = {
		indexName: 'demo_ecommerce',
		searchClient,
	};
}
