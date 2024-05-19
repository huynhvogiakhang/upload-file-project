import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as csv from 'csv-parse';

import { UserData } from 'src/entity/user-data.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CsvDTO } from './dto/csv.dto';
import { Logger } from 'winston';
import { PaginatedResponse } from './dto/file-pagination.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserData)
    private usersDataRepository: Repository<UserData>,
    private readonly logger: Logger,
  ) {}

  async uploadFile(datas: any, user: any): Promise<UserData> {
    const userInfo = await this.usersRepository.findOne({
      where: { username: user.username },
    });

    try {
      for (const data of datas) {
        data.user = userInfo;
        await this.usersDataRepository.insert(data);
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(
        'Error when insert data to database, Maybe record is duplicated',
      );
    }
    return;
  }

  async getUserFile(queryParams: any, user: any) {
    const page = Number(queryParams.page) || 1;
    const size = Number(queryParams.size) || 5;

    const skip = (page - 1) * size;
    const userInfo = await this.usersRepository.findOne({
      where: { username: user.username },
    });
    if (!userInfo) {
      throw new BadRequestException('User not found!');
    }
    const [userDatas, totalCount] = await this.usersDataRepository.findAndCount(
      {
        where: {
          userId: userInfo.id,
        },
        skip,
        take: size,
      },
    );
    const totalPages = Math.ceil(totalCount / size);
    const paginatedResponse: PaginatedResponse<UserData> = {
      userData: userDatas,
      totalCount,
      currentPage: page,
      totalPages,
      size,
    };
    return paginatedResponse;
  }

  async validateCsvData(file): Promise<any> {
    try {
      const parsedData: any = await this.parseCsvData(file);
      if (!parsedData.length) {
        throw new BadRequestException(
          'File Validation Failed: Empty File Provided',
        );
      }

      for await (const [index, rowData] of parsedData.entries()) {
        const validationErrors = await this.validateFileRow(rowData);
        if (validationErrors.length) {
          throw new BadRequestException(
            `File Rows Validation Failed at row: ${index + 1}`,
          );
        }
      }
      return parsedData;
    } catch (error) {
      if (error['message']) this.logger.error(error.message);
      throw new BadRequestException('Error when parse or validate CSV file');
    }
  }

  async parseCsvData(file): Promise<any> {
    const csvContent = file.buffer;
    return new Promise((resolve, reject) => {
      csv.parse(
        csvContent,
        {
          columns: true,
          relax_quotes: true,
          skip_empty_lines: true,
          cast: true,
          bom: true,
        },
        (err, records) => {
          if (err) {
            reject(err);
            return { error: true, message: 'Unable to parse file' };
          }
          resolve(records);
        },
      );
    });
  }

  async validateFileRow(rowData) {
    const errors: string[] = [];
    const csvDto = plainToInstance(CsvDTO, rowData);
    const validationErrors = await validate(csvDto);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        const { property, constraints } = error;
        const errorMessage = `${property}: ${Object.values(constraints).join(', ')}`;
        errors.push(errorMessage);
      });
    }
    return errors;
  }
}
