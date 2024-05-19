import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/core/auth/auth.guard';
import { FeedbackReqDto } from './dto/feedback.dto';
import { FeedbackService } from './feedback.service';

@ApiTags('Feedback')
@Controller('/feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Add upload file feedback for user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: String,
    isArray: true,
  })
  async createFeedBack(
    @Body() data: FeedbackReqDto,
    @Req() request: any,
  ): Promise<any> {
    const user = request['user'];
    return this.feedbackService.createFeedBack(data, user);
  }
}
