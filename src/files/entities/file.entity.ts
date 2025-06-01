import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Tweet } from '../../tweets/entities/tweet.entity'

@Entity('files')
export class File extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string

    @Column()
    filename!: string

    @Column()
    path!: string

    @ManyToOne(() => Tweet, tweet => tweet.images, { nullable: true })
    tweet?: Tweet

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
