import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller('')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getHello(@Req() req: Request, @Res() res: Response): string {
		const resp = this.appService.getHello();
		res.send(resp);
		return resp;
	}
}
