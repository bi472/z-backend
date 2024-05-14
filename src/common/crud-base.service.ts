import { Injectable } from '@nestjs/common';
import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

@Injectable()
export abstract class CrudBaseService<
  Entity extends BaseEntity,
  CreateDto extends DeepPartial<Entity> = DeepPartial<Entity>,
  UpdateDto extends DeepPartial<Entity> = DeepPartial<Entity>,
> {
  protected constructor(protected repo: Repository<Entity>) {}

  async create(dto: CreateDto | DeepPartial<Entity>): Promise<Entity> {
    const entity = this.repo.create(dto);
    await this.repo.save(entity);
    return entity;
  }

  async findOneOrFail(options: FindOneOptions<Entity>): Promise<Entity> {
    return this.repo.findOneOrFail(options);
  }

  async findOne(options: FindOneOptions<Entity>): Promise<Entity> {
    return this.repo.findOne(options);
  }

  async findMany(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repo.find(options);
  }

  async update(
    criteria: FindOneOptions<Entity>,
    dto: UpdateDto | DeepPartial<Entity>,
  ): Promise<Entity> {
    const entity = await this.findOneOrFail(criteria);
    Object.assign(entity, dto);
    await this.repo.save(entity);
    return entity;
  }

  async delete(criteria: FindOneOptions<Entity>): Promise<Entity> {
    const entity = await this.findOneOrFail(criteria);
    return this.repo.remove(entity);
  }

  async save(entity: Entity): Promise<Entity> {
    return this.repo.save(entity);
  }
}
