import { Test, TestingModule } from '@nestjs/testing';
import { NotebookService } from './notebook.service';

describe('NotebookService', () => {
  let service: NotebookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotebookService],
    }).compile();

    service = module.get<NotebookService>(NotebookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
