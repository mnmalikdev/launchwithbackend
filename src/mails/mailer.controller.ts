import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomMailService } from './mailer.service';

@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: CustomMailService) {}

  @ApiOkResponse({
    description: 'Email gets send to test user',
  })
  @ApiOperation({
    summary: 'hit the api trigger',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/sendEmail')
  async sendEmail() {
    return await this.mailerService.sendUserConfirmation(
      'id',
      'mnmalikdev@gmail.com',
    );
  }
}
