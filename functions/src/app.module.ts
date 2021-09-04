import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { NotebookController } from './notebook/notebook.controller';
import { NotebookService } from './notebook/notebook.service';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { RecommendationsController } from './recommendations/recommendations.controller';
import { RecommendationsService } from './recommendations/recommendations.service';

@Module({
	controllers: [
		AppController,
		NotificationController,
		UserController,
		NotebookController,
		AccountController,
		RecommendationsController,
	],
	providers: [AppService, NotificationService, UserService, NotebookService, AccountService, RecommendationsService],
	exports: [AppService, NotificationService, UserService, NotebookService, AccountService, RecommendationsService],
})
export class AppModule {}
