import { Module } from '@nestjs/common';
import { NotebookController } from './notebook.controller';
import { NotebookService } from './notebook.service';
// import { AccessService } from './access/access.service';
// import { NoteService } from './note/note.service';
// import { ReviewService } from './review/review.service';

@Module({
	imports: [],
	controllers: [NotebookController],
	providers: [NotebookService],
})
export class NotebookModule {}
