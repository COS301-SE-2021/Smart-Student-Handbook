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
import { NotebookService } from './notebook.service';
import { Response } from './interfaces/response.interface';
import { Note } from './interfaces/note.interface';

@Controller('notebook')
export class NotebookController {
	constructor(private readonly notebookService: NotebookService) {}

	@Get('findAllUserNotebooks')
	findAllUserNotebooks(): Promise<Notebook[]> {
		return this.notebookService.findAllUserNotebooks();
	}

	@Get('findNotebookById/:notebookId')
	findNotebookById(@Param('notebookId') notebookId): Promise<Notebook> {
		return this.notebookService.findNotebookById(notebookId);
	}

	@Post('createNotebook')
	createNotebook(@Body() notebookDto: NotebookDto): Promise<Response> {
		return this.notebookService.createOrUpdateNotebook(notebookDto, null);
	}

	@Put('updateNotebook/:notebookId')
	updateNotebook(
		@Body() notebookDto: NotebookDto,
		@Param('notebookId') notebookId,
	): Promise<Response> {
		return this.notebookService.createOrUpdateNotebook(notebookDto, notebookId);
	}

	@Delete('deleteNotebook/:notebookId')
	deleteNotebook(@Param('notebookId') notebookId): Promise<Response> {
		return this.notebookService.deleteNotebook(notebookId);
	}

	@Post('createNewNotebook')
	createNewNotebook(@Body() notebookDto: NotebookDto): Promise<Response> {
		return this.notebookService.createNotebook(notebookDto);
	}

	@Post('getNotes')
	getNotes(@Body() noteDto: NoteDto): Promise<Note[]> {
		return this.notebookService.getNotes(noteDto);
	}

	@Post('createNote')
	createNote(@Body() noteDto: NoteDto): Promise<Response> {
		return this.notebookService.createNote(noteDto);
	}

	@Post('updateNote')
	updateNote(@Body() noteDto: NoteDto): Promise<Response> {
		return this.notebookService.updateNote(noteDto);
	}
}
