import { PickType } from '@nestjs/swagger';
import { UserFeedback } from 'src/entity/user-feedback.entity';

export class FeedbackReqDto extends PickType(UserFeedback, ['feedBack']) {}
