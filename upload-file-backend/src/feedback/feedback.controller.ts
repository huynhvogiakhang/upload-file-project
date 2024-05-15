import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FeedbackService } from './feedback.service';
import { FeedbackReqDto } from './dto/feedback.dto';
import { JwtAuthGuard } from 'src/core/auth/auth.guard';
import { Request } from 'express';

@ApiTags('Feedback')
@Controller('/feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Add upload file feedback for user' })
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
    @Req() request: Request,
  ): Promise<any> {
    const user = request['user'];
    return this.feedbackService.createFeedBack(data, user);
  }
}
