import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/core/auth/auth.guard';

import { FileService } from './file.service';
import { UserData } from 'src/entity/user-data.entity';

@ApiTags('file')
@Controller('file')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload file' })
  @ApiBody({
    description: 'The CSV file to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  async uploadFile(
    @UploadedFile() file,
    @Req() request: Request,
  ): Promise<UserData> {
    try {
      const user = request['user'];
      const csvData = await this.fileService.validateCsvData(file);
      return this.fileService.uploadFile(csvData, user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  async getUserFile(
    @Query() query: any,
    @Req() request: Request,
  ): Promise<any> {
    const user = request['user'];
    return this.fileService.getUserFile(query, user);
  }
}
