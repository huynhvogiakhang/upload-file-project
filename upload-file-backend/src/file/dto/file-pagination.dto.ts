import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({ description: 'Array of user data', type: [Object] })
  userData: T[];

  @ApiProperty({ description: 'Total count of user data' })
  totalCount: number;

  @ApiProperty({ description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Number of items per page' })
  size: number;
}
