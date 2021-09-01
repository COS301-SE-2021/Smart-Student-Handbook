import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { NotebookDto } from './dto/notebook.dto';
import { NoteDto } from './dto/note.dto';
import { Notebook } from './interfaces/notebook.interface';
import { Review } from './interfaces/review.interface';
import { NotebookService } from './notebook.service';
import { AuthService } from '../auth/auth.service';
import { Response } from './interfaces/response.interface';
import { Note } from './interfaces/note.interface';
import { ReviewDto } from './dto/review.dto';
import { AccessDto } from './dto/access.dto';

@Controller('notebook')
export class NotebookController {
	constructor(private readonly notebookService: NotebookService, private readonly authService: AuthService) {}

	@Post('createNotebook')
	async createNotebook(@Body() notebookDto: NotebookDto, @Headers() headers): Promise<Response> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.createNotebook(notebookDto, userId);
	}

	@Get('getUserNotebooks')
	async getUserNotebooks(@Headers() headers): Promise<Notebook[]> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.getUserNotebooks(userId);
	}

	@Put('updateNotebook')
	async updateNotebook(@Body() notebookDto: NotebookDto, @Headers() headers): Promise<Response> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.updateNotebook(notebookDto, userId);
	}

	@Delete('deleteNotebook/:notebookId')
	async deleteNotebook(@Param('notebookId') notebookId, @Headers() headers): Promise<Response> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.deleteNotebook(notebookId, userId);
	}

	@Get('getNotes/:noteId')
	getNotes(@Param('noteId') noteId): Promise<Note[]> {
		return this.notebookService.getNotes(noteId);
	}

	@Post('createNote')
	async createNote(@Body() noteDto: NoteDto, @Headers() headers): Promise<Response> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.createNote(noteDto, userId);
	}

	@Put('updateNote')
	async updateNote(@Body() noteDto: NoteDto, @Headers() headers): Promise<Response> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.updateNote(noteDto, userId);
	}

	@Delete('deleteNote/:notebookId/:noteId')
	deleteNote(@Param('notebookId') notebookId, @Param('noteId') noteId): Promise<Response> {
		return this.notebookService.deleteNote({ notebookId, noteId });
	}

	@Post('addNotebookReview')
	async addNotebookReview(@Body() reviewDto: ReviewDto, @Headers() headers): Promise<Response> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.addNotebookReview(reviewDto);
	}

	@Get('getNotebookReviews/:notebookId')
	getNotebookReviews(@Param('notebookId') notebookId): Promise<Review[]> {
		return this.notebookService.getNotebookReviews(notebookId);
	}

	@Delete('deleteNotebookReview/:notebookId/:userId')
	deleteNotebookReview(@Param('notebookId') notebookId, @Param('userId') userId): Promise<Response> {
		return this.notebookService.deleteNotebookReview(notebookId, userId);
	}

	@Post('addAccess')
	async addAccess(@Body() accessDto: AccessDto, @Headers() headers): Promise<Response> {
		const userId: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.addAccess(accessDto, userId);
	}

	@Get('checkUserAccess/:userId/:notebookId')
	async checkUserAccess(
		@Param('userId') userId,
		@Param('notebookId') notebookId,
		@Headers() headers,
	): Promise<boolean> {
		const uid: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.checkUserAccess({ userId, notebookId }, uid);
	}

	@Delete('removeUserAccess/:userId/:notebookId')
	async removeUserAccess(
		@Param('userId') userId,
		@Param('notebookId') notebookId,
		@Headers() headers,
	): Promise<Response> {
		const uid: string = await this.authService.verifyUser(headers.token);
		return this.notebookService.removeUserAccess({ userId, notebookId }, uid);
	}
}
