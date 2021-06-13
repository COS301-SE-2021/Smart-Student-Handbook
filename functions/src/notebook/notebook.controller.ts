import {Controller, Get, Post, Put, Delete, Body, Param} from '@nestjs/common';
import { NotebookDto } from "./dto/notebook.dto";
import { Notebook } from "./interfaces/notebook.interface"
import { NotebookService } from "./notebook.service";

@Controller('notebook')
export class NotebookController
{
	constructor(private readonly notebookService: NotebookService) {}

	@Get()
	findNotebooks(): Promise<Notebook[]>
	{
		return this.notebookService.findNotebooks();
	}

	@Get(':notebookId')
	findNotebook(@Param('notebookId') notebookId): Promise<Notebook>
	{
		return this.notebookService.findNotebook(notebookId);
	}

	@Post()
	createNotebook(@Body() notebookDto: NotebookDto): Promise<string>
	{
		return this.notebookService.createOrUpdateNotebook(notebookDto, null);
	}

	@Put(':notebookId')
	updateNotebook(@Body() notebookDto: NotebookDto, @Param('notebookId') notebookId): Promise<string>
	{
		return this.notebookService.createOrUpdateNotebook(notebookDto, notebookId);
	}

	@Delete(':notebookId')
	deleteNotebook(@Param('notebookId') notebookId): Promise<string>
	{
		return this.notebookService.deleteNotebook(notebookId);
	}

}
