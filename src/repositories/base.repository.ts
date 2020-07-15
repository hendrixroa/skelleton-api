import { AbstractRepository, Brackets, SelectQueryBuilder } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseEntity } from '@/entities/base.entity';
import { IsString, IsUUID } from 'class-validator';

export class UpsertResult {
  @IsString()
  id: string;

  @IsUUID()
  uuid: string;
}

export class BaseSelectOptions {
  public limit?: number;
  public offset?: number;
  public items?: boolean;
  public count?: boolean;
}

export class BaseRepository<T extends BaseEntity> extends AbstractRepository<
  T
> {
  protected getOneItem(items: T[] | undefined): T | undefined {
    return items ? items[0] || undefined : undefined;
  }

  protected getManyItems(items: T[] | undefined): T[] {
    return items || [];
  }

  protected async defaultSelect(
    qb: SelectQueryBuilder<T>,
    options: BaseSelectOptions,
  ) {
    qb.take(options.limit);
    qb.skip(options.offset);

    const itemsQuery =
      options.items !== false ? qb.getMany() : Promise.resolve(undefined);

    const countQuery =
      options.count === true ? qb.getCount() : Promise.resolve(undefined);

    const [items, count] = await Promise.all([itemsQuery, countQuery]);

    return {
      count,
      items,
    };
  }

  protected applySearch(
    qb: SelectQueryBuilder<T>,
    columns: string[],
    search: string,
    options: { threshold: number } = { threshold: 0.5 },
  ) {
    const terms = search
      ? search
          .replace(/\s+/g, ' ')
          .toLowerCase()
          .split(' ')
      : [];
    const term = terms.join(' ');
    const similarity = columns
      .map(col => {
        return `word_similarity(${col}, :searchTerm)`;
      })
      .join(' + ');
    qb.addSelect(similarity, 'similarity');
    qb.orderBy('similarity', 'DESC');
    qb.andWhere(
      new Brackets(orQb => {
        orQb.andWhere(`${similarity} >= :similarityThreshold`, {
          similarityThreshold: options.threshold,
        });
        columns.forEach(col => {
          orQb.orWhere(`${col} ilike :searchPrefix`);
        });
      }),
    );
    qb.setParameter('searchTerm', term);
    qb.setParameter('searchPrefix', `${term.replace(/(%|_)/g, '')}%`);
  }
}
