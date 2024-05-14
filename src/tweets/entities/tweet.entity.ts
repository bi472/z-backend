import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, Generated, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tweets')
export class Tweet extends BaseEntity {
    @Column({ unique: true })
    @Generated('increment')
    id!: number;

    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    content!: string;

    @ManyToOne(() => User, user => user.tweets)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}