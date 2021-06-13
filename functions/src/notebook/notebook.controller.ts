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

	@Put(':id')
	updateNotebook(@Body() notebookDto: NotebookDto, @Param('id') id): Promise<string>
	{
		return this.notebookService.createOrUpdateNotebook(notebookDto, id);
	}

	@Delete(':id')
	deleteNotebook(): string
	{
		return "Delete not yet implemented";
	}

}
