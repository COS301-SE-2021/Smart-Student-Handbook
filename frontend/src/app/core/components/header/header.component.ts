import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	// @ts-ignore
	@Input() sidenav: MatSidenav;
	// constructor() { }

	// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
	ngOnInit(): void {}
}
