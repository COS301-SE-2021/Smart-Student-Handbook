import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotebookService } from '@app/services/notebook.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NoteOperationsService } from './note-operations.service';

describe('NotesService', () => {
	let service: NoteOperationsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				MatDialogModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
			declarations: [],
			providers: [NotebookService],
		});
		service = TestBed.inject(NoteOperationsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
