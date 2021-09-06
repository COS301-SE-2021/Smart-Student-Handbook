import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
	AccountService,
	NotebookObservablesService,
	NotebookService,
} from '@app/services';
import { MatStepper } from '@angular/material/stepper';

@Component({
	selector: 'app-rate-notebook',
	templateUrl: './rate-notebook.component.html',
	styleUrls: ['./rate-notebook.component.scss'],
})
export class RateNotebookComponent implements OnInit {
	firstFormGroup: FormGroup;

	secondFormGroup: FormGroup;

	ratingValue: number = 0;

	review: string = '';

	user: any;

	notebookId: string = '';

	doneLoading: boolean = true;

	smallScreen: boolean = false;

	reviews: [
		{
			review: string;
			reviewer: string;
			rating: number;
		}
	] = [{ review: null, reviewer: null, rating: null }];

	array = [];

	@ViewChild('stepper') stepper: MatStepper;

	constructor(
		private formBuilder: FormBuilder,
		private notebookService: NotebookService,
		private notebookObservables: NotebookObservablesService,
		private accountService: AccountService
	) {}

	ngOnInit(): void {
		this.smallScreen = window.innerWidth <= 991;

		this.doneLoading = true;

		this.notebookObservables.reviewNotebook.subscribe((id: any) => {
			this.notebookId = id.id;

			if (this.notebookId !== '') this.getReviews(this.notebookId);

			if (this.stepper) this.stepper.reset();
		});

		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});

		this.firstFormGroup = this.formBuilder.group({
			firstCtrl: ['', Validators.required],
		});
		this.secondFormGroup = this.formBuilder.group({
			secondCtrl: ['', Validators.required],
		});
	}

	getReviews(id: string) {
		this.doneLoading = false;

		this.notebookService
			.getNotebookReviews(id)
			.subscribe((reviews: any[]) => {
				// console.log(reviews);
				for (let i = 0; i < this.reviews.length; i += 1) {
					this.reviews.pop();
				}
				reviews.forEach((review: any) => {
					this.reviews.push({
						review: review.message,
						reviewer: review.displayName,
						rating: review.rating,
					});
				});

				this.doneLoading = true;
			});
	}

	submitReview() {
		const review = {
			notebookId: this.notebookId,
			message: this.review,
			rating: this.ratingValue,
			displayName: this.user.displayName,
			userId: this.user.uid,
			profileUrl: this.user.profilePic,
		};

		if (this.secondFormGroup.valid) {
			this.notebookService.addNotebookReview(review).subscribe(
				() => {
					// console.log(res);
					this.reviews.push({
						review: review.message,
						reviewer: review.displayName,
						rating: review.rating,
					});
				},
				(error) => {
					// console.log(error);
				}
			);
		}
	}

	close() {
		// this.bottomSheetRef.dismiss();
	}
}
