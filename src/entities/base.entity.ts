import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  Index,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  public id: number;

  @Column()
  @Generated('uuid')
  @Index({ unique: true })
  public uuid: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  public createdAt: Date;

  @CreateDateColumn({
    default: null,
    name: 'updated_at',
    nullable: true,
    type: 'timestamp with time zone',
  })
  public updateAt: Date;
}
