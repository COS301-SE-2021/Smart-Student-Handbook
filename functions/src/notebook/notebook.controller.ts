import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { Notebook } from './interfaces/notebook.interface';
import { Review } from './interfaces/review.interface';
import { NotebookService } from './notebook.service';
import { AuthService } from '../auth/auth.service';
import { Response } from './interfaces/response.interface';
import { Note } from './interfaces/note.interface';
// import { ReviewDto } from './dto/review.dto';
// import { AccessDto } from './dto/access.dto';
import { UpdateNotebookDto } from './dto/updateNotebook.dto';
import { CreateNotebookDto } from './dto/createNotebook.dto';
import { CreateNoteDto } from './dto/createNote.dto';
import { NoteService } from './note/note.service';
import { ReviewService } from './review/review.service';
// import { AccessService } from './access/access.service';
import { UpdateNoteDto } from './dto/updateNote.dto';
import { AddNotebookReview } from './dto/addNotebookReview';
import { AccessService } from './access/access.service';
import { Access } from './interfaces/access.interface';

@Controller('notebook')
export class NotebookController {
	constructor(
		private readonly notebookService: NotebookService,
		private readonly authService: AuthService,
		private readonly noteService: NoteService,
		private readonly reviewService: ReviewService,
		private readonly accessService: AccessService,
	) {}

	@Get('getUserNotebooks')
	async getUserNotebooks(@Headers() header): Promise<Notebook[]> {
		const userId: string = await this.authService.verifyUser(header.token);
		return this.notebookService.getUserNotebooks(userId);
	}

	@Get('getNotebook/:notebookId')
	async getNotebook(@Param('notebookId') notebookId: string): Promise<FirebaseFirestore.DocumentData> {
		return this.notebookService.getNotebook(notebookId);
	}

	@Post('createNotebook')
	async createNotebook(@Body() notebookDto: CreateNotebookDto, @Headers() header): Promise<Response> {
		const userId: string = await this.authService.verifyUser(header.token);
		return this.notebookService.createNotebook(notebookDto, userId);
	}

	@Put('updateNotebook')
	async updateNotebook(@Body() notebookDto: UpdateNotebookDto, @Headers() header): Promise<Response> {
		const userId: string = await this.authService.verifyUser(header.token);
		return this.notebookService.updateNotebook(notebookDto, userId);
	}

	@Delete('deleteNotebook/:notebookId')
	async deleteNotebook(@Param('notebookId') notebookId, @Headers() header): Promise<Response> {
		const userId: string = await this.authService.verifyUser(header.token);
		return this.notebookService.deleteNotebook(notebookId, userId);
	}

	@Get('getNotes/:noteId')
	getNotes(@Param('noteId') noteId): Promise<Note[]> {
		return this.noteService.getNotes(noteId);
	}

	@Post('createNote')
	async createNote(@Body() noteDto: CreateNoteDto, @Headers() header): Promise<Response> {
		const userId: string = await this.authService.verifyUser(header.token);
		return this.noteService.createNote(noteDto, userId);
	}

	@Put('updateNote')
	async updateNote(@Body() updateNoteDto: UpdateNoteDto, @Headers() header): Promise<Response> {
		const userId: string = await this.authService.verifyUser(header.token);
		return this.noteService.updateNote(updateNoteDto, userId);
	}

	@Delete('deleteNote/:notebookId/:noteId')
	deleteNote(@Param('notebookId') notebookId, @Param('noteId') noteId): Promise<Response> {
		return this.noteService.deleteNote(noteId);
	}

	@Post('addNotebookReview')
	async addNotebookReview(@Body() addNotebookReview: AddNotebookReview, @Headers() header): Promise<Response> {
		const userId: string = await this.authService.verifyUser(header.token);
		return this.reviewService.addNotebookReview(addNotebookReview, userId);
	}

	@Get('getNotebookReviews/:notebookId')
	getNotebookReviews(@Param('notebookId') notebookId): Promise<Review[]> {
		return this.reviewService.getNotebookReviews(notebookId);
	}

	@Get('getAccessList/:notebookId')
	getAccessList(@Param('notebookId') notebookId): Promise<Access[]> {
		return this.accessService.getAccessList(notebookId);
	}
}
//
// @Delete('deleteNotebookReview/:notebookId/:userId')
// deleteNotebookReview(@Param('notebookId') notebookId, @Param('userId') userId): Promise<Response> {
// 	return this.reviewService.deleteNotebookReview(notebookId);
// }
//
// @Post('addAccess')
// async addAccess(@Body() accessDto: AccessDto, @Headers() header): Promise<Response> {
// 	const userId: string = await this.authService.verifyUser(header.token);
// 	return this.accessService.addAccess(accessDto);
// }

// @Get('checkUserAccess/:userId/:notebookId')
// async checkUserAccess(@Param('userId') userId, @Param('notebookId') notebookId,
// @Headers() header): Promise<boolean> {
// 	const userId: string = await this.authService.verifyUser(header.token);
// 	return this.notebookService.checkUserAccess({ userId, notebookId });
// }
//
// @Delete('removeUserAccess/:userId/:notebookId')
// async removeUserAccess(
// 	@Param('userId') userId,
// 	@Param('notebookId') notebookId,
// 	@Headers() header,
// ): Promise<Response> {
// 	const userId: string = await this.authService.verifyUser(header.token);
// 	return this.notebookService.removeUserAccess({ userId, notebookId });
// }
