import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  /**
   * @IsLong
   */
  @ApiProperty()
  public limit: number;

  /**
   * @IsLong
   */
  @ApiProperty()
  public offset: number;

  /**
   * @IsLong
   */
  @ApiProperty()
  public count: number;
}

export class PaginationFileMeta {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public nextPageToken?: string;

  @IsInt()
  @Max(1000)
  @Min(1)
  @ApiProperty()
  public limit: number;

  @ApiProperty()
  public count: number;
}

export class PaginationResult<T> {
  public items: T[];
  public meta: PaginationMeta;
}

export class PaginationPayload {
  @IsInt()
  @Max(100)
  @Min(1)
  @ApiProperty()
  public limit: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty()
  public offset?: number;
}

export class PaginationFilePayload {
  @IsInt()
  @Max(100)
  @Min(1)
  @ApiProperty()
  public limit: number;

  @ApiProperty()
  @IsString()
  public nextPageToken?: string;
}

export class SuccessResponse<T> {
  public data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export class PaginationResponse<
  T extends PaginationResult<K>,
  K = any
> extends SuccessResponse<T> {
  constructor(result: T) {
    super(result);
  }
}
