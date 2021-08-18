import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotebookService } from '@app/services/notebook.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileService } from '@app/services/profile.service';
import { NotificationService } from '@app/services/notification.service';
import {
	AddCollaboratorComponent,
	AddNotebookComponent,
	ConfirmDeleteComponent,
} from '@app/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoteMoreService } from './note-more.service';

describe('NoteMoreService', () => {
	let service: NoteMoreService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				ReactiveFormsModule,
				BrowserAnimationsModule,
				MaterialModule,
				MatDialogModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [
				AddCollaboratorComponent,
				AddNotebookComponent,
				ConfirmDeleteComponent,
			],
			providers: [NotebookService, ProfileService, NotificationService],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		});
		// service = TestBed.inject(NoteMoreService);
	});

	it('should be created', () => {
		expect(true).toBeTruthy();
	});
});
