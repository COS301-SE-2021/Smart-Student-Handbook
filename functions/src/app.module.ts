import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { NotebookController } from './notebook/notebook.controller';
import { NotebookService } from './notebook/notebook.service';

@Module({
  imports: [],
  controllers: [AppController, NotificationController, UserController, NotebookController],
  providers: [AppService, NotificationService, UserService, NotebookService],
})
export class AppModule {}
