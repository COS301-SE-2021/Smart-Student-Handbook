import {Controller, Get, Post, Put, Delete, Body, Param} from '@nestjs/common';
import { NotebookDto } from "./dto/notebook.dto";
import { Notebook } from "./interfaces/notebook.interface"
import { NotebookService } from "./notebook.service";

@Controller('notebook')
export class NotebookController
{
	constructor(private readonly notebookService: NotebookService) {}

	@Get("findAllUserNotebooks/:userId")
	findAllUserNotebooks(@Param('userId') userId): Promise<Notebook[]>
	{
		return this.notebookService.findAllUserNotebooks(userId);
	}

	@Get('findNotebookById/:notebookId')
	findNotebookById(@Param('notebookId') notebookId): Promise<Notebook>
	{
		return this.notebookService.findNotebookById(notebookId);
	}

	@Post("createNotebook/:userId")
	createNotebook(@Body() notebookDto: NotebookDto, @Param('userId') userId: string): Promise<string>
	{
		return this.notebookService.createOrUpdateNotebook(notebookDto, null, userId);
	}

	@Put('updateNotebook/:notebookId/:userId')
	updateNotebook(@Body() notebookDto: NotebookDto, @Param('notebookId') notebookId, @Param('userId') userId: string): Promise<string>
	{
		return this.notebookService.createOrUpdateNotebook(notebookDto, notebookId, userId);
	}

	@Delete('deleteNotebook/:notebookId')
	deleteNotebook(@Param('notebookId') notebookId): Promise<string>
	{
		return this.notebookService.deleteNotebook(notebookId);
	}

}
