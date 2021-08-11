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

@Module({
	imports: [],
	controllers: [AppController, NotificationController, UserController, NotebookController, AccountController],
	providers: [AppService, NotificationService, UserService, NotebookService, AccountService],
	exports: [AppService, NotificationService, UserService, NotebookService, AccountService],
})
export class AppModule {}
