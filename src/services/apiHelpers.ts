import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { appConfig } from '@/config/appConfig';

export class PaginationMeta {
  /**
   * @IsLong
   */
  public limit: number;

  /**
   * @IsLong
   */
  public offset: number;

  /**
   * @IsLong
   */
  public count: number;
}

export class PaginationResult<T> {
  public items: T[];
  public meta: PaginationMeta;
}

export class PaginationPayload {
  @IsInt() @Max(appConfig.maxPaginationLimit) @Min(1) public limit: number;
  @IsOptional() @IsInt() @Min(0) public offset?: number;
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
