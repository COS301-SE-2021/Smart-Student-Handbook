import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
} from '@nestjs/common';
import { NotebookDto } from './dto/notebook.dto';
import { NoteDto } from './dto/note.dto';
import { Notebook } from './interfaces/notebook.interface';
import { Review } from './interfaces/review.interface';
import { NotebookService } from './notebook.service';
import { Response } from './interfaces/response.interface';
import { Note } from './interfaces/note.interface';
import { ReviewDto } from './dto/review.dto';

@Controller('notebook')
export class NotebookController {
	constructor(private readonly notebookService: NotebookService) {}

	// @Get('findAllUserNotebooks')
	// findAllUserNotebooks(): Promise<Notebook[]> {
	// 	return this.notebookService.findAllUserNotebooks();
	// }
	//
	// @Get('findNotebookById/:notebookId')
	// findNotebookById(@Param('notebookId') notebookId): Promise<Notebook> {
	// 	return this.notebookService.findNotebookById(notebookId);
	// }
	//
	// @Post('createNotebook')
	// createNotebook(@Body() notebookDto: NotebookDto): Promise<Response> {
	// 	return this.notebookService.createOrUpdateNotebook(notebookDto, null);
	// }
	//
	// @Put('updateNotebook/:notebookId')
	// updateNotebook(
	// 	@Body() notebookDto: NotebookDto,
	// 	@Param('notebookId') notebookId,
	// ): Promise<Response> {
	// 	return this.notebookService.createOrUpdateNotebook(notebookDto, notebookId);
	// }
	//
	// @Delete('deleteNotebook/:notebookId')
	// deleteNotebook(@Param('notebookId') notebookId): Promise<Response> {
	// 	return this.notebookService.deleteNotebook(notebookId);
	// // }

	@Post('createNotebook')
	createNotebook(@Body() notebookDto: NotebookDto): Promise<Response> {
		return this.notebookService.createNotebook(notebookDto);
	}

	@Get('getUserNotebooks')
	getUserNotebooks(): Promise<Notebook[]> {
		return this.notebookService.getUserNotebooks();
	}

	@Get('getNotes')
	getNotes(@Body() noteDto: NoteDto): Promise<Note[]> {
		return this.notebookService.getNotes(noteDto);
	}

	@Post('createNote')
	createNote(@Body() noteDto: NoteDto): Promise<Response> {
		return this.notebookService.createNote(noteDto);
	}

	@Put('updateNote')
	updateNote(@Body() noteDto: NoteDto): Promise<Response> {
		return this.notebookService.updateNote(noteDto);
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
	deleteNotebookReview(@Param('notebookId') notebookId): Promise<Review[]> {
		return this.notebookService.deleteNotebookReview(notebookId);
	}
}
