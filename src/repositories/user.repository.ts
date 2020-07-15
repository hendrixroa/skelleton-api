import { EntityRepository } from 'typeorm';

import { User } from '@/entities/user.entity';
import { BaseRepository, BaseSelectOptions } from './base.repository';

export interface UserSelectOptions extends BaseSelectOptions {
  id?: string;
  uuid?: string;
  search?: string;
  email?: string;
  username?: string;
  role?: string;
}

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  public async save(user: User) {
    return this.repository.save(user);
  }

  public async update(user: User) {
    return this.repository
      .createQueryBuilder()
      .update(User)
      .set(user)
      .andWhere('id = :id', { id: user.id })
      .execute();
  }

  public async select(options: UserSelectOptions = {}) {
    const qb = this.repository.createQueryBuilder('user');

    if (options.id) {
      qb.andWhere('user.id = :id', { id: options.id });
    }
    if (options.email) {
      qb.andWhere('user.email = :email', { email: options.email });
    }
    if (options.username) {
      qb.andWhere('user.username = :username', { username: options.username });
    }
    if (options.role) {
      qb.andWhere('user.role = :role', { role: options.role });
    }
    if (options.uuid) {
      qb.andWhere('user.uuid = :uuid', { uuid: options.uuid });
    }
    return this.defaultSelect(qb, options);
  }

  public async getById(id: string): Promise<User | undefined> {
    const { items } = await this.select({ id });
    return this.getOneItem(items);
  }

  public async getByUUID(uuid: string): Promise<User | undefined> {
    const { items } = await this.select({ uuid });
    return this.getOneItem(items);
  }

  public async getByEmail(email: string): Promise<User | undefined> {
    const { items } = await this.select({ email });
    return this.getOneItem(items);
  }

  public async getByUsername(username: string): Promise<User | undefined> {
    const { items } = await this.select({ username });
    return this.getOneItem(items);
  }
}
