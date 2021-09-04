import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetRecommendationDto } from './dto/getRecommendation.dto';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
	constructor(private readonly recommendationService: RecommendationsService) {}

	@Post('getRecommendations')
	async getRecommendations(@Body() getRecommendation: GetRecommendationDto) {
		return this.recommendationService.getRecommendations(getRecommendation);
	}

	@Get('listData')
	async listData() {
		return this.recommendationService.listData();
	}
}
