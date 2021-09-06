import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Module({
  providers: [RecommendationsService]
})
export class RecommendationsModule {}
