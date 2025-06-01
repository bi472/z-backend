import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    Generated,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    OneToMany
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { File } from '../../files/entities/file.entity'

@Entity('tweets')
export class Tweet extends BaseEntity {
    @Column({ unique: true })
    @Generated('increment')
    id!: number

    @PrimaryGeneratedColumn('uuid')
    uuid!: string

    @Column()
    content!: string

    @OneToMany(() => File, file => file.tweet, { cascade: true })
    images!: File[]

    @ManyToOne(() => User, user => user.tweets)
    user!: User

    @ManyToMany(() => User, user => user.likedTweets)
    likedBy: User[]

    @ManyToMany(() => User, user => user.bookmarkedTweets)
    bookmarkedBy: User[]

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
