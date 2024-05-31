import { User } from "../../users/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, Generated, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NotificationType } from "../notification-type.enum";

@Entity('notifications')
export class Notification extends BaseEntity{

    @Column({ unique: true })
    @Generated('increment')
    id!: number;

    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    type!: NotificationType;

    @Column({ default: false })
    read: boolean;

    @ManyToOne(() => User, user => user.notifications)
    user!: User;

    @ManyToOne(() => User)
    createdBy!: User;

    @Column({ nullable: true })
    tweetId: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
    
}
