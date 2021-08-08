import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { user } from 'firebase-functions/lib/providers/auth';
import { NotebookDto } from './dto/notebook.dto';
import { NoteDto } from './dto/note.dto';
import { Notebook } from './interfaces/notebook.interface';
import { Review } from './interfaces/review.interface';
import { NotebookService } from './notebook.service';
import { Response } from './interfaces/response.interface';
import { Note } from './interfaces/note.interface';
import { ReviewDto } from './dto/review.dto';
import { AccessDto } from './dto/access.dto';
import { CheckAccessDto } from './dto/checkAccess.dto';

@Controller('notebook')
export class NotebookController {
	constructor(private readonly notebookService: NotebookService) {}

	@Post('createNotebook')
	createNotebook(@Body() notebookDto: NotebookDto): Promise<Response> {
		return this.notebookService.createNotebook(notebookDto);
	}

	@Get('getUserNotebooks')
	getUserNotebooks(): Promise<Notebook[]> {
		return this.notebookService.getUserNotebooks();
	}

	@Get('getNotes/:noteId')
	getNotes(@Param('noteId') noteId): Promise<Note[]> {
		return this.notebookService.getNotes(noteId);
	}

	@Post('createNote')
	createNote(@Body() noteDto: NoteDto): Promise<Response> {
		return this.notebookService.createNote(noteDto);
	}

	@Put('updateNote')
	updateNote(@Body() noteDto: NoteDto): Promise<Response> {
		return this.notebookService.updateNote(noteDto);
	}

	@Delete('deleteNotebook/:notebookId')
	deleteNotebook(@Param('notebookId') notebookId): Promise<Response> {
		return this.notebookService.deleteNotebook(notebookId);
	}

	@Delete('deleteNote/:notebookId/:noteId')
	deleteNote(@Param('notebookId') notebookId, @Param('noteId') noteId): Promise<Response> {
		return this.notebookService.deleteNote({ notebookId, noteId });
	}

	@Post('addNotebookReview')
	addNotebookReview(@Body() reviewDto: ReviewDto): Promise<Response> {
		return this.notebookService.addNotebookReview(reviewDto);
	}

	@Get('getNotebookReviews/:notebookId')
	getNotebookReviews(@Param('notebookId') notebookId): Promise<Review[]> {
		return this.notebookService.getNotebookReviews(notebookId);
	}

	@Delete('deleteNotebookReview/:notebookId')
	deleteNotebookReview(@Param('notebookId') notebookId): Promise<Response> {
		return this.notebookService.deleteNotebookReview(notebookId);
	}

	@Post('addAccess')
	addAccess(@Body() accessDto: AccessDto): Promise<Response> {
		return this.notebookService.addAccess(accessDto);
	}

	@Get('checkUserAccess/:userId/:notebookId')
	checkUserAccess(@Param('userId') userId, @Param('notebookId') notebookId): Promise<boolean> {
		return this.notebookService.checkUserAccess({ userId, notebookId });
	}

	@Delete('removeUserAccess/:userId/:notebookId')
	removeUserAccess(@Param('userId') userId, @Param('notebookId') notebookId): Promise<Response> {
		return this.notebookService.removeUserAccess({ userId, notebookId });
	}
}
