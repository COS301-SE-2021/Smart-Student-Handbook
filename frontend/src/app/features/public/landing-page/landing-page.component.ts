import {
	AfterContentChecked,
	AfterContentInit,
	AfterViewChecked,
	AfterViewInit,
	Component,
	OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/services';
import * as AOS from 'aos';

@Component({
	selector: 'app-landing-page',
	templateUrl: './landing-page.component.html',
	styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent
	implements
		OnInit,
		AfterViewInit,
		AfterContentInit,
		AfterViewChecked,
		AfterContentChecked
{
	teamMembers: any[] = [
		{
			name: 'Arno Möller',
			linkedIn: 'https://www.linkedin.com/in/arno-m%C3%B6ller-a96a8920b/',
			github: 'https://github.com/Arno-Moller',
			profile:
				'https://firebasestorage.googleapis.com/v0/b/smartstudentnotebook.appspot.com/o/profile%2FArno.jpeg?alt=media&token=587d0566-8625-4e23-a12b-dc21df934170',
		},
		{
			name: 'Douglas van Reeuwyk',
			linkedIn: 'https://www.linkedin.com/in/douglasvanreeuwyk/',
			github: 'https://github.com/Douglas6312',
			profile:
				'https://firebasestorage.googleapis.com/v0/b/smartstudentnotebook.appspot.com/o/profile%2FDouglas.jpg?alt=media&token=cce4ba8d-3f4d-4e43-a3d4-d8fdb5b927a2',
		},
		{
			name: 'Louw Claassens',
			linkedIn:
				'https://www.linkedin.com/in/aj-louw-claassens-2b296a19a/',
			github: 'https://github.com/LouwC',
			profile:
				'https://firebasestorage.googleapis.com/v0/b/smartstudentnotebook.appspot.com/o/profile%2FLouw.jpeg?alt=media&token=d5131a1e-abb0-4617-8939-f5e5f101a4be',
		},
		{
			name: 'Luca Prenzler',
			linkedIn: 'https://www.linkedin.com/in/luca-prenzler-5aaa0920b/',
			github: 'https://github.com/LucaPrenzler',
			profile:
				'https://firebasestorage.googleapis.com/v0/b/smartstudentnotebook.appspot.com/o/profile%2FLuca.jpg?alt=media&token=62d10c16-8799-42e3-aeef-135869721b88',
		},
		{
			name: 'Theo Morkel',
			linkedIn: 'https://www.linkedin.com/in/theo-morkel-197610206',
			github: 'https://github.com/u19002514-Theo-Morkel',
			profile:
				'https://firebasestorage.googleapis.com/v0/b/smartstudentnotebook.appspot.com/o/profile%2FTheo.jpg?alt=media&token=630b9023-7315-4f0e-abd0-8427353e8ae0',
		},
	];

	constructor(
		private router: Router,
		private accountService: AccountService
	) {
		// redirect to home if already logged in
		if (this.accountService.getLoginState) {
			this.router.navigate(['/home']);
		}
	}

	ngOnInit(): void {
		AOS.init({
			easing: 'ease-out-back',
			duration: 1000,
		});

		window.addEventListener('load', AOS.refresh);
	}

	ngAfterViewInit(): void {
		// AOS.refresh();
	}

	ngAfterContentInit(): void {
		// AOS.refresh();
	}

	ngAfterViewChecked(): void {
		// AOS.refresh();
	}

	ngAfterContentChecked(): void {
		// AOS.refresh();
	}
}
