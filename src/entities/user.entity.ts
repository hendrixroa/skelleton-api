import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { pick } from 'lodash';

import { BaseEntity } from './base.entity';

@Entity({ name: 'users' })
@Index('users_unique_lower_email', { synchronize: false })
export class User extends BaseEntity {
  @PrimaryColumn({
    type: 'text',
  })
  @IsEmail()
  public email: string;

  @PrimaryColumn({
    type: 'text',
  })
  public username: string;

  @Column({
    name: 'first_name',
    nullable: false,
    type: 'text',
  })
  @IsNotEmpty()
  public firstName: string;

  @Column({
    name: 'last_name',
    nullable: false,
    type: 'text',
  })
  @IsNotEmpty()
  public lastName: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  @IsNotEmpty()
  public role: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  @IsNotEmpty()
  public avatar: string;

  @Column({
    default: false,
    nullable: false,
  })
  public active: boolean;
}
