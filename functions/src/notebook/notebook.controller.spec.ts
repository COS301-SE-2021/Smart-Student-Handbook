import { Test, TestingModule } from '@nestjs/testing'
import { NotebookController } from './notebook.controller'
import { NotebookService } from './notebook.service'

describe('AccountController', () => {
	let notebookService: NotebookService
	let notebookController: NotebookController

	beforeEach(async () => {
		notebookService = new NotebookService()
		notebookController = new NotebookController(notebookService)
	})

	it('should be defined', () => {
		expect(notebookController).toBeDefined()
	})
})
