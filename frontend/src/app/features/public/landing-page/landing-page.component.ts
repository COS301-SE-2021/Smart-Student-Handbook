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
				'url(../../../../assets/logo/SmartStudentHandbookLogo.png)',
		},
		{
			name: 'Douglas van Reeuwyk',
			linkedIn: 'https://www.linkedin.com/in/douglasvanreeuwyk/',
			github: 'https://github.com/Douglas6312',
			profile:
				'url(../../../../assets/logo/SmartStudentHandbookLogo.png)',
		},
		{
			name: 'Louw Claassens',
			linkedIn:
				'https://www.linkedin.com/in/aj-louw-claassens-2b296a19a/',
			github: 'https://github.com/LouwC',
			profile:
				'url(../../../../assets/logo/SmartStudentHandbookLogo.png)',
		},
		{
			name: 'Luca Prenzler',
			linkedIn: 'https://www.linkedin.com/in/luca-prenzler-5aaa0920b/',
			github: 'https://github.com/LucaPrenzler',
			profile:
				'url(../../../../assets/logo/SmartStudentHandbookLogo.png)',
		},
		{
			name: 'Theo Morkel',
			linkedIn: 'https://www.linkedin.com/in/theo-morkel-197610206',
			github: 'https://github.com/u19002514-Theo-Morkel',
			profile:
				'url(../../../../assets/logo/SmartStudentHandbookLogo.png)',
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
