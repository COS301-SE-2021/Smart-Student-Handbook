import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsService', () => {
	let service: RecommendationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [RecommendationsService],
		}).compile();

		service = module.get<RecommendationsService>(RecommendationsService);

		jest.setTimeout(30000);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Testing recommendations', () => {
		it('should return noteIds', async () => {
			const recs = {
				name: 'COS 301',
				tags: ['Software Engineering'],
				author: 'William',
				institution: 'University of Pretoria',
				course: 'COS 301',
			};
			const result = await service.getRecommendations(recs);

			expect(result.success).toBe(true);
		});
	});
});
