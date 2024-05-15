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

class PaginatedResponse<T> {
  userData: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  size: number;
}

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserData)
    private usersDataRepository: Repository<UserData>,
    private readonly logger: Logger,
  ) {}

  async uploadFile(datas: UserData[], user: any): Promise<UserData> {
    const userInfo = await this.usersRepository.findOne({
      where: { username: user.username },
    });

    for (const data of datas) {
      data.user = userInfo;
      await this.usersDataRepository.insert(data);
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
    const csvContent = file.buffer;
    try {
      const parsedData: any = await new Promise((resolve, reject) => {
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
      const errors: string[] = [];
      if (!parsedData.length) {
        errors.push('Empty File Provided');
        return {
          error: true,
          message: 'File Validation Failed',
          errorsArray: errors,
        };
      }

      //validate All Rows
      for await (const [index, rowData] of parsedData.entries()) {
        const validationErrors = await this.validateFileRow(rowData);
        if (validationErrors.length) {
          return {
            error: true,
            message: `File Rows Validation Failed at row: ${index + 1}`,
            errorsArray: validationErrors,
          };
        }
      }
      return parsedData;
    } catch (error) {
      if (error['message']) this.logger.error(error.message);
      throw new BadRequestException('Error when parse or validate CSV file');
    }
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
