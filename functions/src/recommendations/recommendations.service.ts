import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { GetRecommendationDto } from './dto/getRecommendation.dto';

@Injectable()
export class RecommendationsService {
	async getRecommendations(getRecommendation: GetRecommendationDto) {
		const notebookData = {
			name: getRecommendation.name,
			tags: getRecommendation.tags,
			author: getRecommendation.author,
			institution: getRecommendation.institution,
			course: getRecommendation.course,
		};

		const url = 'https://smartassist-nii4biypla-uc.a.run.app/getReccommendation';

		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(notebookData),
		};

		return fetch(url, options)
			.then((res) => res.json())
			.then((json) => json)
			.catch((err) => console.error(`error:${err}`));
	}

	async listData() {
		const url = 'https://smartassist-nii4biypla-uc.a.run.app/listData';

		const options = { method: 'GET' };

		return fetch(url, options)
			.then((res) => res.json())
			.then((json) => json)
			.catch((err) => console.error(`error:${err}`));
	}
}
